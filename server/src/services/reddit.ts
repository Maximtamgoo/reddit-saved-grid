import RedditError from '../utils/RedditError'
import { CookieOptions, Response } from 'express'
import { RedditClassParams, TokenHintType, RedditRequestParams, RedditTokenResponseType, BookmarkState } from '../types'

const importDynamic = new Function('modulePath', 'return import(modulePath)')
const fetch = async (...args: unknown[]) => {
  const module = await importDynamic('node-fetch')
  return module.default(...args)
}

export default class Reddit {
  static readonly cookieOptions: CookieOptions = {
    sameSite: (process.env.NODE_ENV === 'production') ? 'none' : 'strict',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    signed: true
  }
  private readonly base64Creds: string
  private readonly userAgent: string
  private readonly redirectUri: string
  private accessToken: string | null
  private refreshToken: string | null
  private expiresIn: number | null
  private newTokens: boolean

  constructor({ userAgent, clientId, clientSecret, redirectUri, accessToken, refreshToken }: RedditClassParams) {
    this.base64Creds = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    this.userAgent = userAgent
    this.redirectUri = redirectUri
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    this.expiresIn = null
    this.newTokens = false
  }

  isNewTokens() {
    return this.newTokens
  }

  setTokenCookies(res: Response) {
    const expiresAt = Date.now() + ((this.expiresIn ?? 3600) * 1000)
    const expiresAtMonth = Date.now() + (2592000 * 1000)
    res.cookie('access_token', this.accessToken, { ...Reddit.cookieOptions, expires: new Date(expiresAt) })
    res.cookie('refresh_token', this.refreshToken, { ...Reddit.cookieOptions, expires: new Date(expiresAtMonth) })
  }

  async apiRequest(freshParams: RedditRequestParams) {
    async function request() {
      const { url, options } = freshParams()
      const res = await fetch(url, options)
      if (res.ok) {
        return await res.json()
      } else {
        throw new RedditError(res.status, res.statusText)
      }
    }

    try {
      if (this.accessToken) {
        return await request()
      } else {
        throw new RedditError(401, 'Unauthorized')
      }
    } catch (error) {
      if (error instanceof RedditError && error.status === 401) {
        console.log(error.message)
        await this.getRefreshToken()
        return await request()
      } else {
        throw error
      }
    }
  }

  async getMe() {
    return await this.apiRequest(() => ({
      url: 'https://oauth.reddit.com/api/v1/me',
      options: {
        headers: {
          'User-Agent': this.userAgent,
          'Authorization': `Bearer ${this.accessToken}`
        }
      }
    })) as Promise<{ name: string }>
  }

  getSavedContent(username: string, after: string, limit = '24') {
    // unused params: type, before, count
    if (username && limit) {
      return this.apiRequest(() => ({
        url: `https://oauth.reddit.com/user/${username}/saved?after=${after}&limit=${limit}&raw_json=1`,
        options: {
          headers: {
            'User-Agent': this.userAgent,
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      }))
    } else {
      throw new RedditError(400, 'Bad Request')
    }
  }

  bookmarkContent(id: string, state: BookmarkState) {
    if (id && state) {
      return this.apiRequest(() => ({
        url: `https://oauth.reddit.com/api/${state}`,
        options: {
          method: 'POST',
          headers: {
            'User-Agent': this.userAgent,
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `id=${id}`
        }
      }))
    } else {
      throw new RedditError(400, 'Bad Request')
    }
  }

  async authRequest(url: string, options: RequestInit) {
    try {
      const res = await fetch(url, options)
      console.log('res.status:', res.status)
      if (res.ok) {
        console.log('res.headers.get(content-length):', res.headers.get('content-length'))
        if (res.headers.get('content-length') === '0') {
          console.log('content-length')
          return undefined
        } else {
          console.log('json')
          return await res.json()
        }
      } else {
        throw new RedditError(res.status, res.statusText)
      }
    } catch (error) {
      console.log('CATCH error:', error)
    }
  }

  async authorize(code: string) {
    console.log(`authorize(${code})`)
    if (code) {
      const data = await this.authRequest('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
          'User-Agent': this.userAgent,
          'Authorization': `Basic ${this.base64Creds}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=authorization_code&code=${code}&redirect_uri=${this.redirectUri}`
      }) as RedditTokenResponseType
      this.accessToken = data.access_token
      this.refreshToken = data.refresh_token
      this.expiresIn = data.expires_in
      this.newTokens = true
    } else {
      throw new RedditError(401, 'Unauthorized')
    }
  }

  async getRefreshToken() {
    console.log(`refreshToken(${this.refreshToken})`)
    if (this.refreshToken) {
      const data = await this.authRequest('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
          'User-Agent': this.userAgent,
          'Authorization': `Basic ${this.base64Creds}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=refresh_token&refresh_token=${this.refreshToken}&redirect_uri=${this.redirectUri}`
      }) as RedditTokenResponseType
      this.accessToken = data.access_token
      this.refreshToken = data.refresh_token
      this.expiresIn = data.expires_in
      this.newTokens = true
    } else {
      throw new RedditError(401, 'Unauthorized')
    }
  }

  revokeToken(tokenHint: TokenHintType) {
    console.log(`revokeToken(${tokenHint})`)
    const token = (tokenHint === 'refresh_token') ? this.refreshToken : this.accessToken
    console.log('token:', token)
    if (token) {
      return this.authRequest('https://www.reddit.com/api/v1/revoke_token', {
        method: 'POST',
        headers: {
          'User-Agent': this.userAgent,
          'Authorization': `Basic ${this.base64Creds}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `token=${token}&token_type_hint=${tokenHint}&redirect_uri=${this.redirectUri}`
      })
    } else {
      throw new RedditError(401, 'Unauthorized')
    }
  }
}