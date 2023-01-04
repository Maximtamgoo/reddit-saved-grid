import HttpError from '../utils/HttpError'

export async function authorize(authorization_code: string) {
  const res = await fetch('/api/authorize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ authorization_code })
  })

  if (res.ok) {
    return await res.json()
  } else {
    throw new HttpError(res.status, res.statusText)
  }
}

export async function getNewAccessToken(refresh_token: string | null) {
  const res = await fetch('/api/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token })
  })
  if (res.ok) {
    return await res.json()
  } else {
    throw new HttpError(res.status, res.statusText)
  }
}

export async function signOut(refresh_token: string | null) {
  const res = await fetch('/api/signout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token })
  })
  if (res.ok) {
    return await res.text()
  } else {
    throw new HttpError(res.status, res.statusText)
  }
}