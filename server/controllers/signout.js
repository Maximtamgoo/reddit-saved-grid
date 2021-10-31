module.exports = async (req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  try {
    await req.reddit.revokeToken('refresh_token')
    res.clearCookie('access_token')
    res.clearCookie('refresh_token')
    res.send({})
  } catch (error) {
    console.log('signout error:', error)
    next(error)
  }
}