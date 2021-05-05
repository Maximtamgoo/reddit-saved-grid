const router = require('express').Router();
const reddit = require('../../services/reddit');

router.get('/api/user/:username/saved', async (req, res) => {
  console.log(`${req.method} ${req.path}`)
  try {
    const access_token = req.cookies.access_token
    const username = req.params.username
    if (!access_token || !username) throw 'missing access_token or username'
    const options = { ...req.query, type: 'links', limit: 10 }
    const { rateLimit, data } = await reddit.getSavedContent(access_token, username, options)
    res.set(rateLimit)
    res.send(data)
  } catch (error) {
    console.log('error:', error)
    res.status(400).send()
  }
})

module.exports = router;