module.exports = async (req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  try {
    const authorization_code = req.headers.authorization_code
    console.log('authorization_code:', authorization_code)

    const data = await req.reddit.authorize(authorization_code)
    console.log('data:', data)
    req.reddit.access_token = data.access_token
    req.reddit.expires_in = data.expires_in
    req.reddit.refresh_token = data.refresh_token
    res = req.reddit.setTokenCookies(res)

    const me = await req.reddit.getMe()
    res.send({ username: me.name })
  } catch (error) {
    next(error)
  }
}