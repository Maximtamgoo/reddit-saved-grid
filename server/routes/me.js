const router = require('express').Router()

module.exports = router.get('/api/me', async (req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  try {
    const me = await req.reddit.getMe()
    // res.set(rateLimit)
    if (req.reddit.newTokens) {
      res = req.reddit.setTokenCookies(res)
    }
    console.log(`send({ username: ${me.name} })`)
    res.send({ username: me.name })
  } catch (error) {
    next(error)
  }
})