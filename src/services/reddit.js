import { v4 as uuidv4 } from 'uuid';

export function authRedirect() {
  const state = uuidv4()
  window.localStorage.setItem('redirect_state', state)
  window.location.href = `https://www.reddit.com/api/v1/authorize?client_id=${process.env.REACT_APP_REDDIT_CLIENTID}&response_type=code&state=${state}&redirect_uri=${process.env.REACT_APP_REDDIT_REDIRECT_URI}&duration=permanent&scope=identity history save`
}

export async function authorize() {
  // console.log('authorize()')
  try {
    return await fetch('/api/authorize', {
      credentials: 'same-origin'
    })
  } catch (error) {
    throw error
  }
}

async function fetchAccessToken(options) {
  try {
    return await fetch('/api/accesstoken', options)
  } catch (error) {
    console.log('error:', error)
    throw error
  }
}

export function requestAccessToken(code) {
  console.log(`requestAccessToken(${code})`)
  return fetchAccessToken({
    headers: {
      'authorization_code': code
    }
  })
}

export function refreshAccessToken() {
  console.log('refreshAccessToken()')
  return fetchAccessToken({
    credentials: 'same-origin'
  })
}

async function apiRequest(path, options) {
  try {
    const res = await fetch(path, options)
    // console.log('x-ratelimit-remaining:', res.headers.get('x-ratelimit-remaining'))
    // console.log('x-ratelimit-reset:', res.headers.get('x-ratelimit-reset'))
    // console.log('x-ratelimit-used:', res.headers.get('x-ratelimit-used'))

    const data = await res.json()
    if (data?.error) {
      throw data.error
    }

    return data

    // return {
    //   rateLimit: {
    //     'x-ratelimit-remaining': res.headers.get('x-ratelimit-remaining'),
    //     'x-ratelimit-reset': res.headers.get('x-ratelimit-reset'),
    //     'x-ratelimit-used': res.headers.get('x-ratelimit-used')
    //   },
    //   data
    // }
  } catch (error) {
    throw error
  }
}

export function getMe(access_token) {
  return apiRequest('https://oauth.reddit.com/api/v1/me', {
    headers: { 'Authorization': `Bearer ${access_token}` }
  })
}

export function getSavedContent(access_token, username, params) {
  const { type, before, after, count, limit = 3 } = params
  return apiRequest(`https://oauth.reddit.com/user/${username}/saved?type=${type}&before=${before}&after=${after}&count=${count}&limit=${limit}&raw_json=1`,
    {
      headers: { 'Authorization': `Bearer ${access_token}` }
    })
}

export function unsaveContent(id, access_token) {
  return apiRequest('https://oauth.reddit.com/api/unsave', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `id=${id}`
  })
}

export function saveContent(id, access_token) {
  return apiRequest('https://oauth.reddit.com/api/save', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `id=${id}`
  })
}

export async function getFakeData() {
  try {
    const res = await fetch('/api/fakedata')
    return await res.json()
  } catch (error) {
    throw error
  }
}