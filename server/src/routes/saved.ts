import express from 'express'
const router = express.Router()

export default router.get('/api/saved/:username', async (req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  try {
    const username = req.params.username
    const after = req.query.after as string
    const limit = process.env.REDDIT_LIMIT
    const data = await req.reddit.getSavedContent(username, after, limit)
    // res.set(rateLimit)
    if (req.reddit.isNewTokens()) {
      req.reddit.setTokenCookies(res)
    }
    console.log('send(data)')
    res.send(data)
  } catch (error) {
    next(error)
  }
})