import express from 'express'
const router = express.Router()

export default router.get('/api/me', async (req, res, next) => {
  try {
    const me = await req.reddit.getMe()
    // res.set(rateLimit)
    if (req.reddit.isNewTokens()) {
      req.reddit.setTokenCookies(res)
    }
    // console.log(`send({ name: ${me.name} })`)
    res.send({ name: me.name })
  } catch (error) {
    next(error)
  }
})