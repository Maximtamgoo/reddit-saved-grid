import express from 'express'
import Reddit from '../services/reddit'
const router = express.Router()

export default router.post('/api/signout', async (req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  try {
    await req.reddit.revokeToken('refresh_token')
    res.clearCookie('access_token', Reddit.cookieOptions)
    res.clearCookie('refresh_token', Reddit.cookieOptions)
    res.send({})
  } catch (error) {
    console.log('signout error:', error)
    next(error)
  }
})