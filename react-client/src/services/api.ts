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

async function apiRequest(url: string, options?: Options) {
  const res = await fetch(url, { credentials: 'include', mode: 'cors', ...options })
  if (res.ok) {
    return await res.json()
  } else if (res.status === 401) {
    throw aError('UnauthorizedError', 'Unauthorized request')
  } else {
    throw aError('BadRequestError', 'Request failed')
  }
}

export function authorize(code: string) {
  return apiRequest('/api/authorize', { headers: { authorization_code: code } })
}

export function getMe() {
  return apiRequest('/api/me')
}

export function signOut() {
  return apiRequest('/api/signout', { method: 'POST' })
}

export function getSavedContent(name: string, after: string) {
  return apiRequest(`/api/saved/${name}?after=${after}`)
}

export function bookmarkContent(id: string, state: string) {
  console.log(`bookmarkContent(${id}, ${state})`)
  return apiRequest(`/api/bookmark/${state}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  })
}