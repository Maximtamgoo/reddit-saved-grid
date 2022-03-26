import express from 'express'
const router = express.Router()

export default router.get('/api/authorize', async (req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  try {
    const authorization_code = req.headers.authorization_code as string
    console.log('authorization_code:', authorization_code)

    await req.reddit.authorize(authorization_code)
    req.reddit.setTokenCookies(res)

    const me = await req.reddit.getMe()
    res.send({ username: me.name })
  } catch (error) {
    next(error)
  }
})