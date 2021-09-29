require('dotenv').config()
const helmet = require('helmet')
const setTokenCookies = require('./middleware/setTokenCookies')
const cookieParser = require('cookie-parser')
const express = require('express')
const app = express()

app.use(helmet())
app.use(cookieParser(process.env.REACT_APP_COOKIE_SECRET))
app.use(express.json())
app.use(express.static('public'))

app.get('/api/authorize', require('./routes/api/authorize'), setTokenCookies())
app.get('/api/accesstoken', require('./routes/api/accesstoken'), setTokenCookies())
// app.get('/api/me', require('./routes/api/me'))
// app.get('/api/saved', require('./routes/api/saved'))

app.get('/api/fakedata', (req, res) => {
  console.log(`${req.method} ${req.path} : route`)

  const children = []
  for (let i = 0; i < 30; i++) {
    children.push({ data: { name: `fake${i}`, image: `/fake${i}.jpg` } })
  }

  res.send({
    data: {
      children
    }
  })
})

app.use('*', (req, res, next) => {
  res.status(404).send('404: Page Not Found')
})

const port = 5000
app.listen(port, () => {
  console.log('server started on port:', port)
})