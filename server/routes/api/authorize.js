const router = require('express').Router();
const reddit = require('../../services/reddit');

router.get('/api/authorize', async (req, res, next) => {
  console.log(`${req.method} ${req.path} : route`)
  try {
    const access_token = req.cookies.access_token
    // const expires_at = req.signedCookies.expires_at
    const refresh_token = req.signedCookies.refresh_token

    if (access_token && refresh_token) {
      res.send()
    } else if (!access_token && refresh_token) {
      const data = await reddit.refreshAccessToken(refresh_token)
      res.locals.access_token = data.access_token
      res.locals.expires_in = data.expires_in
      res.locals.refresh_token = refresh_token
      next()
    } else {
      res.sendStatus(401)
    }
  } catch (error) {
    console.log('error:', error)
    res.sendStatus(400)
  }
})

// router.get('/api/authorize', setTokenCookies())

module.exports = router;