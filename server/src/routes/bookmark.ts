import express from 'express'
import { BookmarkState } from '../types'
const router = express.Router()

export default router.post('/api/bookmark/:state', async (req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  try {
    console.log('req.body.id:', req.body.id)
    console.log('req.params.state', req.params.state)

    await req.reddit.bookmarkContent(req.body.id, req.params.state as BookmarkState)
    // res.set(rateLimit)
    if (req.reddit.isNewTokens()) {
      req.reddit.setTokenCookies(res)
    }
    console.log('send()')
    res.send({})
  } catch (error) {
    console.log('save error:', error)
    next(error)
  }
})