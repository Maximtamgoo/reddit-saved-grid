import Reddit from '../services/reddit'

export default ({
  userAgent, clientId, clientSecret, redirectUri
}) => {
  return (req, _res, next) => {
    req.reddit = new Reddit({
      userAgent,
      clientId,
      clientSecret,
      redirectUri,
      accessToken: req.signedCookies?.access_token,
      refreshToken: req.signedCookies?.refresh_token
    })
    next()
  }
}