const fetch = require('node-fetch')

const base64Creds = Buffer.from(`${process.env.REACT_APP_REDDIT_CLIENTID}:${process.env.REACT_APP_REDDIT_CLIENTSECRET}`).toString('base64')

async function fetchAccessToken(postData) {
  try {
    // let postDataStr = ''
    // Object.keys(postDataObj).forEach((key) => {
    //   postDataStr += `${key}=${postDataObj[key]}&`
    // })
    postData += `&redirect_uri=${process.env.REACT_APP_REDDIT_REDIRECT_URI}`

    const res = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        // 'User-Agent': process.env.REACT_APP_REDDIT_USERAGENT,
        'Authorization': `Basic ${base64Creds}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: postData
    })

    if (res.status !== 200) {
      throw `status: ${res.status}, statusText: ${res.statusText}`
    }

    const data = await res.json()
    if (data?.error) {
      throw data.error
    }

    return data
  } catch (error) {
    console.log('fetchAccessToken error:', error)
    throw error
  }
}

function requestAccessToken(code) {
  console.log(`requestAccessToken(${code})`)
  return fetchAccessToken(`grant_type=authorization_code&code=${code}`)
}

function refreshAccessToken(refresh_token) {
  console.log(`refreshAccessToken(${refresh_token})`)
  return fetchAccessToken(`grant_type=refresh_token&refresh_token=${refresh_token}`)
}

// async function apiRequest(path, access_token) {
//   try {
//     const res = await fetch(path, {
//       headers: {
//         'User-Agent': process.env.REACT_APP_REDDIT_USERAGENT,
//         'Authorization': `Bearer ${access_token}`
//       }
//     })
//     console.log('x-ratelimit-remaining:', res.headers.get('x-ratelimit-remaining'))
//     console.log('x-ratelimit-reset:', res.headers.get('x-ratelimit-reset'))
//     console.log('x-ratelimit-used:', res.headers.get('x-ratelimit-used'))

//     const data = await res.json()
//     if (data?.error) {
//       throw data.error
//     }

//     return {
//       rateLimit: {
//         'x-ratelimit-remaining': res.headers.get('x-ratelimit-remaining'),
//         'x-ratelimit-reset': res.headers.get('x-ratelimit-reset'),
//         'x-ratelimit-used': res.headers.get('x-ratelimit-used')
//       },
//       data
//     }
//   } catch (error) {
//     throw error
//   }
// }

// function getMe(access_token) {
//   return apiRequest('https://oauth.reddit.com/api/v1/me', access_token)
// }

// function getSavedContent(access_token, username, options) {
//   const { type, before, after, count, limit } = options
//   return apiRequest(`https://oauth.reddit.com/user/${username}/saved?type=${type}&before=${before}&after=${after}&count=${count}&limit=${limit}`, access_token)
// }

module.exports = { requestAccessToken, refreshAccessToken }