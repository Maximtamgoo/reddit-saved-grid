import Reddit from '../services/reddit'

declare module 'express-serve-static-core' {
  interface Request {
    reddit: Reddit
  }
}

export type RedditClassParams = {
  userAgent: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  accessToken: string | null,
  refreshToken: string | null
}

export type RedditTokenResponseType = {
  access_token: string,
  refresh_token: string,
  expires_in: number
}

export type TokenHintType = 'access_token' | 'refresh_token'

export type RedditRequestParams = () => {
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

export type BookmarkState = 'save' | 'unsave'