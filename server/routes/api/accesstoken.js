const router = require('express').Router();
const reddit = require('../../services/reddit');

router.get('/api/accesstoken', async (req, res, next) => {
  console.log(`${req.method} ${req.path} : route`)
  try {
    const authorization_code = req.headers.authorization_code
    const refresh_token = req.signedCookies.refresh_token
    console.log('authorization_code:', authorization_code)
    console.log('refresh_token:', refresh_token)

    if (authorization_code && refresh_token) {
      throw 'expected only authorization_code or refresh_token but got both'
    } else if (authorization_code) {
      const data = await reddit.requestAccessToken(authorization_code)
      // console.log('data:', data)
      res.locals.access_token = data.access_token
      res.locals.expires_in = data.expires_in
      res.locals.refresh_token = data.refresh_token
      next()
    } else if (refresh_token) {
      const data = await reddit.refreshAccessToken(refresh_token)
      res.locals.access_token = data.access_token
      res.locals.expires_in = data.expires_in
      res.locals.refresh_token = refresh_token
      next()
    } else {
      throw 'missing authorization_code or refresh_token'
    }
  } catch (error) {
    console.log('error:', error)
    res.status(400).send()
    res.sendStatus
  }
})

module.exports = router;