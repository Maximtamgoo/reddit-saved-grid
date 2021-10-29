const Reddit = require('../services/reddit')

module.exports = function reddit({
  userAgent,
  clientId,
  clientSecret,
  redirectUri
}) {
  return (req, res, next) => {
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