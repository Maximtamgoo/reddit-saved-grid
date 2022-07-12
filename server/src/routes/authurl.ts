import express from 'express'
const router = express.Router()

export default router.get('/api/authurl', async (req, res, next) => {
  try {
    res.redirect(`https://www.reddit.com/api/v1/authorize?client_id=${process.env.REDDIT_CLIENTID}&response_type=code&state=_&redirect_uri=${process.env.REDDIT_REDIRECT_URI}&duration=permanent&scope=identity history save`)
  } catch (error) {
    next(error)
  }
})