import fetch from 'node-fetch'
import aError from '../utils/createError'
import { CookieOptions, Response } from 'express'

type RedditTokenType = {
  access_token: string,
  refresh_token: string,
  expires_in: number
}

type RedditFields = {
  base64Creds: string,
  userAgent: string,
  newTokens: boolean,
  token: RedditTokenType
}

type RedditRequestParams = () => {
  url: string,
  options: {
    method?: 'GET' | 'POST',
    headers: {
      'User-Agent': string,
      'Authorization': string,
      'Content-Type'?: 'application/x-www-form-urlencoded'
    },
    body?: string
  }
}

// type RedditRequestParams = {
//   url: string,
//   options: {
//     method: 'GET' | 'POST',
//     headers: {
//       'User-Agent': string,
//       'Authorization': string,
//       'Content-Type': 'application/x-www-form-urlencoded'
//     },
//     body: string
//   }
// }

export default class Reddit {
  private readonly base64Creds: string
  private readonly userAgent: string
  private readonly redirectUri: string
  private access_token: string
  private refresh_token: string
  private expires_in: number
  private newTokens: boolean

  constructor({ userAgent, clientId, clientSecret, redirectUri, accessToken, refreshToken }) {
    this.base64Creds = Buffer.from(`${clientId}:${clientSecret} `).toString('base64')
    this.userAgent = userAgent
    this.redirectUri = redirectUri
    this.access_token = accessToken
    this.refresh_token = refreshToken
    this.expires_in = null
    this.newTokens = false
  }

  isNewTokens() {
    return this.newTokens
  }

  setTokenCookies(res: Response) {
    const expires_at = Date.now() + (this.expires_in * 1000)
    const expires_at_month = Date.now() + (2592000 * 1000)

    const cookieOptions: CookieOptions = { sameSite: 'strict', secure: true, httpOnly: true, signed: true }
    res.cookie('access_token', this.access_token, { ...cookieOptions, expires: new Date(expires_at) })
    res.cookie('refresh_token', this.refresh_token, { ...cookieOptions, expires: new Date(expires_at_month) })
  }

  async apiRequest(freshParams: RedditRequestParams) {
    async function request() {
      const { url, options } = freshParams()
      const res = await fetch(url, options)
      if (res.ok) {
        return await res.json()
      } else if (res.status === 401) {
        throw aError('UnauthorizedError', 'Unauthorized request')
      } else {
        throw aError('BadRequestError', 'Request failed')
      }
    }

    try {
      if (this.access_token) {
        return await request()
      } else {
        throw aError('UnauthorizedError', 'Unauthorized request')
      }
    } catch (error) {
      console.log('apiRequest error:', error.name)
      if (error.name === 'UnauthorizedError') {
        const data = await this.refreshToken()
        this.access_token = data.access_token
        this.refresh_token = data.refresh_token
        this.expires_in = data.expires_in
        this.newTokens = true
        return await request()
      } else {
        throw error
      }
    }
  }

  getMe() {
    return this.apiRequest(() => ({
      url: 'https://oauth.reddit.com/api/v1/me',
      options: {
        headers: {
          'User-Agent': this.userAgent,
          'Authorization': `Bearer ${this.access_token} `
        }
      }
    })) as Promise<{ name: string }>
  }


  getSavedContent(username: string, after: string, limit = 24) {
    // unused params: type, before, count
    if (username && limit) {
      return this.apiRequest(() => ({
        url: `https://oauth.reddit.com/user/${username}/saved?after=${after}&limit=${limit}&raw_json=1`,
        options: {
          headers: {
            'User-Agent': this.userAgent,
            'Authorization': `Bearer ${this.access_token}`
          }
        }
      }))
    } else {
      throw aError('BadRequestError', 'Request failed')
    }
  }

  unsaveContent(id) {
    if (id) {
      return this.apiRequest(() => ({
        url: 'https://oauth.reddit.com/api/unsave',
        options: {
          method: 'POST',
          headers: {
            'User-Agent': this.userAgent,
            'Authorization': `Bearer ${this.access_token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `id=${id}`
        }
      }))
    } else {
      throw aError('BadRequestError', 'Request failed')
    }
  }

  saveContent(id) {
    if (id) {
      return this.apiRequest(() => ({
        url: 'https://oauth.reddit.com/api/save',
        options: {
          method: 'POST',
          headers: {
            'User-Agent': this.userAgent,
            'Authorization': `Bearer ${this.access_token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `id=${id}`
        }
      }))
    } else {
      throw aError('BadRequestError', 'Request failed')
    }
  }

  async oauthRequest(url, options): Promise<RedditTokenType> {
    async function request() {
      const res = await fetch(url, options)
      if (res.ok) {
        console.log('res.headers:', res.headers.get('content-length'))
        if (res.headers.get('content-length') === '0') {
          return undefined
        } else {
          return await res.json()
        }
      } else if (res.status === 401) {
        throw aError('UnauthorizedError', 'Unauthorized request')
      } else {
        throw aError('BadRequestError', 'Request failed')
      }
    }
    return await request()
  }

  authorize(code) {
    console.log(`authorize(${code})`)
    if (code) {
      return this.oauthRequest('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
          'User-Agent': this.userAgent,
          'Authorization': `Basic ${this.base64Creds}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=authorization_code&code=${code}&redirect_uri=${this.redirectUri}`
      })
    } else {
      throw aError('UnauthorizedError', 'Unauthorized request')
    }
  }

  refreshToken() {
    console.log(`refreshToken(${this.refresh_token})`)
    if (this.refresh_token) {
      return this.oauthRequest('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
          'User-Agent': this.userAgent,
          'Authorization': `Basic ${this.base64Creds}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=refresh_token&refresh_token=${this.refresh_token}&redirect_uri=${this.redirectUri}`
      })
    } else {
      throw aError('UnauthorizedError', 'Unauthorized request')
    }
  }

  revokeToken(token_type_hint) {
    console.log(`revokeToken(${token_type_hint})`)
    const token = this[token_type_hint]
    console.log('token:', token)
    if (token) {
      return this.oauthRequest('https://www.reddit.com/api/v1/revoke_token', {
        method: 'POST',
        headers: {
          'User-Agent': this.userAgent,
          'Authorization': `Basic ${this.base64Creds}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `token=${token}&token_type_hint=${token_type_hint}&redirect_uri=${this.redirectUri}`
      })
    } else {
      throw aError('UnauthorizedError', 'Unauthorized request')
    }
  }
}