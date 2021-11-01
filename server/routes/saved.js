const router = require('express').Router()

module.exports = router.get('/api/saved/:username', async (req, res) => {
  console.log(`${req.method} ${req.path}`)
  try {
    const username = req.params.username
    const after = req.query.after
    const limit = 24

    const data = await req.reddit.getSavedContent(username, { after, limit })
    // res.set(rateLimit)
    if (req.reddit.newTokens) {
      res = req.reddit.setTokenCookies(res)
    }
    console.log(`send(data)`)
    res.send(data)
  } catch (error) {
    next(error)
  }
})