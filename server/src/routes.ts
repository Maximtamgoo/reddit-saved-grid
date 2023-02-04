import express from 'express'
import { env } from './envConfig.js'
import { authorize, getNewAccessToken, revokeToken, toggleBookmark } from './reddit.js'
import { z } from 'zod'
const router = express.Router()

router.get('/api/authurl', async (_req, res, next) => {
  try {
    res.redirect(`https://www.reddit.com/api/v1/authorize?client_id=${env.REDDIT_CLIENTID}&response_type=code&state=_&redirect_uri=${env.REDDIT_REDIRECT_URI}&duration=permanent&scope=identity history save`)
  } catch (error) {
    next(error)
  }
})

router.post('/api/authorize', async (req, res, next) => {
  try {
    const authorization_code = z.string({ required_error: 'Invalid authorization_code' }).max(100).parse(req.body.authorization_code)
    const token = await authorize(authorization_code)
    res.send(token)
  } catch (error) {
    next(error)
  }
})

router.post('/api/access_token', async (req, res, next) => {
  try {
    const refresh_token = z.string({ required_error: 'Invalid refresh_token' }).max(100).parse(req.body.refresh_token)
    const token = await getNewAccessToken(refresh_token)
    res.send(token)
  } catch (error) {
    next(error)
  }
})

router.post('/api/signout', async (req, res, next) => {
  try {
    const refresh_token = z.string({ required_error: 'Invalid refresh_token' }).max(100).parse(req.body.refresh_token)
    const WeirdRedditResponse = await revokeToken('refresh_token', refresh_token)
    res.send(WeirdRedditResponse)
  } catch (error) {
    next(error)
  }
})

router.post('/api/bookmark/:state', async (req, res, next) => {
  try {
    const state = z.literal('unsave').or(z.literal('save')).parse(req.params.state)
    const id = z.string({ required_error: 'Invalid id' }).parse(req.query.id)
    const bearerAccessToken = z.string({ required_error: 'Invalid access_token' }).parse(req.headers.authorization)
    const access_token = bearerAccessToken.split(' ')[1]
    const data = await toggleBookmark(access_token, state, id)
    res.send(data)
  } catch (error) {
    next(error)
  }
})

export default router