import HttpError from '../utils/HttpError'
import { getNewAccessToken } from './redditTokens'
import { useTokenStore } from '../store'

async function oauthRequest(url: string, options?: RequestInit) {
  const access_token = useTokenStore.getState().access_token

  async function request(access_token: string | null) {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    })
    if (res.ok) {
      return await res.json()
    } else {
      throw new HttpError(res.status, res.statusText)
    }
  }

  try {
    return await request(access_token)
  } catch (error) {
    if (error instanceof HttpError && error.status === 401) {
      const refresh_token = useTokenStore.getState().refresh_token
      const token = await getNewAccessToken(refresh_token)
      useTokenStore.getState().setTokens(token.access_token, token.refresh_token)
      return await request(token.access_token)
    } else {
      throw error
    }
  }
}

export function getMe() {
  return oauthRequest('https://oauth.reddit.com/api/v1/me')
}

export function getSavedContent(username: string, after: string | null, limit = 50) {
  return oauthRequest(`https://oauth.reddit.com/user/${username}/saved?after=${after}&limit=${limit}&raw_json=1`)
}

export function toggleBookmark(id: string, state: 'unsave' | 'save') {
  return oauthRequest(`/api/bookmark/${state}?id=${id}`, {
    method: 'POST'
  })
}