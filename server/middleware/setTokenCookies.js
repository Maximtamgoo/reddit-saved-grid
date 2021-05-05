function setTokenCookies() {
  return (req, res, next) => {
    try {
      console.log(`${req.method} ${req.path} : setTokenCookies()`)

      const access_token = res.locals.access_token
      const expires_in = res.locals.expires_in
      const refresh_token = res.locals.refresh_token

      const expires_at = Date.now() + (expires_in * 1000) - (60 * 1000)

      const cookieOptions = { sameSite: 'strict', secure: true }
      res.cookie('access_token', access_token, { ...cookieOptions, expires: new Date(expires_at) })
      res.cookie('refresh_token', refresh_token, { ...cookieOptions, httpOnly: true, signed: true })
      res.send()
    } catch (error) {
      console.log('setTokenCookies error:', error)
      res.sendStatus(500)
    }
  }
}

module.exports = setTokenCookies