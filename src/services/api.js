import { v4 as uuidv4 } from 'uuid'
import aError from '../utils/createError'

class Api {
  constructor() {
    this.username = null
  }

  setUsername(name) {
    this.username = name
  }

  signInWithReddit() {
    const state = uuidv4()
    window.localStorage.setItem('redirect_state', state)
    window.location.href = `https://www.reddit.com/api/v1/authorize?client_id=${process.env.REACT_APP_REDDIT_CLIENTID}&response_type=code&state=${state}&redirect_uri=${process.env.REACT_APP_REDDIT_REDIRECT_URI}&duration=permanent&scope=identity history save`
  }

  async apiRequest(url, options) {
    try {
      const res = await fetch(url, { credentials: 'same-origin', ...options })
      // console.log('res:', res)
      if (res.ok) {
        return await res.json()
      } else if (res.status === 401) {
        throw aError('UnauthorizedError', 'Unauthorized request')
      } else {
        throw aError('BadRequestError', 'Request failed')
      }
    } catch (error) {
      // console.log('error:', error)
      throw error
    }
  }

  authorize(code) {
    return this.apiRequest('/api/authorize', { headers: { 'authorization_code': code } })
  }

  getMe() {
    return this.apiRequest('/api/me')
  }

  signOut() {
    return this.apiRequest('/api/signout', { method: 'POST' })
  }

  getSavedContent(after) {
    return this.apiRequest(`/api/saved/${this.username}?after=${after}`)
  }

  unsaveContent(id) {
    console.log(`unsaveContent(${id})`)
    return this.apiRequest('/api/unsave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
  }

  saveContent(id) {
    console.log(`saveContent(${id})`)
    return this.apiRequest('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
  }
}

export default new Api()