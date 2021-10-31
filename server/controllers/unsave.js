module.exports = async (req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  try {
    console.log('req.body.id:', req.body.id)
    await req.reddit.unsaveContent(req.body.id)
    // res.set(rateLimit)
    if (req.reddit.newTokens) {
      res = req.reddit.setTokenCookies(res)
    }
    console.log(`send()`)
    res.send({})
  } catch (error) {
    console.log('unsave error:', error)
    next(error)
  }
}