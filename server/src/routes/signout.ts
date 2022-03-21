import express from 'express'
const router = express.Router()

export default router.post('/api/signout', async (req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  try {
    await req.reddit.revokeToken('refresh_token')
    const cookieOptions = { sameSite: 'strict', secure: true, httpOnly: true, signed: true }
    res.clearCookie('access_token', cookieOptions)
    res.clearCookie('refresh_token', cookieOptions)
    res.send({})
  } catch (error) {
    console.log('signout error:', error)
    next(error)
  }
})