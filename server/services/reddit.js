'use strict'
const fetch = require('node-fetch')
const aError = require('../utils/createError')

module.exports = class Reddit {
  constructor({ userAgent, clientId, clientSecret, redirectUri, accessToken, refreshToken }) {
    this.base64Creds = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    this.userAgent = userAgent
    this.redirectUri = redirectUri
    this.access_token = accessToken
    this.refresh_token = refreshToken
    this.expiresIn = null
    this.newTokens = false
  }

  setTokenCookies(res) {
    const expires_at = Date.now() + (this.expires_in * 1000)

    const cookieOptions = { sameSite: 'strict', secure: true, httpOnly: true, signed: true }
    res.cookie('access_token', this.access_token, { ...cookieOptions, expires: new Date(expires_at) })
    res.cookie('refresh_token', this.refresh_token, cookieOptions)
    return res
  }

  async apiRequest(freshParams) {
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
      // console.log('apiRequest error:', error.name)
      if (error.name === 'UnauthorizedError') {
        try {
          const data = await this.refreshToken()
          this.access_token = data.access_token
          this.refresh_token = data.refresh_token
          this.expiresIn = data.expires_in
          this.newTokens = true
          return await request()
        } catch (error) {
          // console.log('this.refreshToken error:', error.name)
          throw error
        }
      } else {
        throw error
      }
    }
  }

  getMe() {
    return this.apiRequest(() => ({
      url: 'https://oauth.reddit.com/api/v1/me',
      options: { headers: { 'Authorization': `Bearer ${this.access_token}` } }
    }))
  }

  getSavedContent(username, params) {
    const { type, before, after, count, limit = 24 } = params
    if (username && limit) {
      return this.apiRequest(() => ({
        url: `https://oauth.reddit.com/user/${username}/saved?after=${after}&limit=${limit}&raw_json=1`,
        options: { headers: { 'Authorization': `Bearer ${this.access_token}` } }
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
          headers: { 'Authorization': `Bearer ${this.access_token}` },
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
          headers: { 'Authorization': `Bearer ${this.access_token}` },
          body: `id=${id}`
        }
      }))
    } else {
      throw aError('BadRequestError', 'Request failed')
    }
  }

  async oauthRequest(url, options) {
    const request = async () => {
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
      const data = await request()
      return data
    } catch (error) {
      throw error
    }
  }

  authorize(code) {
    console.log(`authorize(${code})`)
    if (code) {
      return this.oauthRequest('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
          // 'User-Agent': process.env.REACT_APP_REDDIT_USERAGENT,
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
          // 'User-Agent': process.env.REACT_APP_REDDIT_USERAGENT,
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
    if (token) {
      return this.oauthRequest('https://www.reddit.com/api/v1/revoke_token', {
        method: 'POST',
        headers: {
          // 'User-Agent': process.env.REACT_APP_REDDIT_USERAGENT,
          'Authorization': `Basic ${this.base64Creds}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `token=${token}&token_type_hint=${token_type_hint}`
      })
    } else {
      throw aError('UnauthorizedError', 'Unauthorized request')
    }
  }
}