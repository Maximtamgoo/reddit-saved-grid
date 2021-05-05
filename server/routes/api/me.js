const router = require('express').Router();
const reddit = require('../../services/reddit');

router.get('/api/me', async (req, res) => {
  console.log(`${req.method} ${req.path}`)
  try {
    const access_token = req.cookies.access_token ?? res.locals.access_token
    if (!access_token) throw 'missing access_token'
    const { rateLimit, data } = await reddit.getMe(access_token)
    res.set(rateLimit)
    res.send(data)
  } catch (error) {
    console.log('error:', error)
    res.status(400).send()
  }
})

module.exports = router;