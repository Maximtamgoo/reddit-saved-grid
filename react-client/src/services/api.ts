import aError from '../utils/createError'

type Options = {
  method?: string,
  credentials?: RequestCredentials,
  headers?: {
    authorization_code?: string,
    ['Content-Type']?: string
  },
  body?: string
}

class Api {
  private username: string | null

  constructor() {
    this.username = null
  }

  setUsername(name: string) {
    this.username = name
  }

  async apiRequest(url: string, options?: Options) {
    const res = await fetch(url, { credentials: 'same-origin', ...options })
    // console.log('res:', res)
    if (res.ok) {
      return await res.json()
    } else if (res.status === 401) {
      throw aError('UnauthorizedError', 'Unauthorized request')
    } else {
      throw aError('BadRequestError', 'Request failed')
    }
  }

  authorize(code: string) {
    return this.apiRequest('/api/authorize', { headers: { authorization_code: code } })
  }

  getMe() {
    return this.apiRequest('/api/me')
  }

  signOut() {
    return this.apiRequest('/api/signout', { method: 'POST' })
  }

  getSavedContent(after: string | null) {
    return this.apiRequest(`/api/saved/${this.username}?after=${after}`)
  }

  bookmarkContent(id: string, state: string) {
    console.log(`bookmarkContent(${id}, ${state})`)
    return this.apiRequest(`/api/bookmark/${state}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
  }
}

export default new Api()