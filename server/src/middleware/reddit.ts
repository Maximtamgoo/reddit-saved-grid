import { RequestHandler } from 'express'
import Reddit from '../services/reddit'

type Params = {
  userAgent: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
}

export default ({ userAgent, clientId, clientSecret, redirectUri }: Params) => {
  return ((req, _res, next) => {
    req.reddit = new Reddit({
      userAgent,
      clientId,
      clientSecret,
      redirectUri,
      accessToken: req.signedCookies.access_token ?? null,
      refreshToken: req.signedCookies.refresh_token ?? null
    })
    next()
  }) as RequestHandler
}