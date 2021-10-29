'use strict'
require('dotenv').config()
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const reddit = require('./middleware/reddit')
const controllers = require('./controllers')
const routes = require('./routes')
const express = require('express')
const app = express()

app.use(helmet())
app.use(cookieParser(process.env.REACT_APP_COOKIE_SECRET))
app.use(reddit({
  userAgent: process.env.REACT_APP_REDDIT_USERAGENT,
  clientId: process.env.REACT_APP_REDDIT_CLIENTID,
  clientSecret: process.env.REACT_APP_REDDIT_CLIENTSECRET,
  redirectUri: process.env.REACT_APP_REDDIT_REDIRECT_URI
}))

app.use(express.json())
app.use(express.static('public'))

app.use(routes(controllers))

app.use(function (error, req, res, next) {
  if (error.name === 'UnauthorizedError') {
    console.log('express error:', error.name)
    res.sendStatus(401)
  } else if (error.name === 'BadRequestError') {
    console.log('express error:', error.name)
    res.sendStatus(400)
  } else {
    console.log('express error:', error)
    res.sendStatus(500)
  }
})

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

// todo set up dev & prod env
// todo figure out starting nodemon with dev & prod env

const port = 5000
app.listen(port, () => {
  console.log('server started on port:', port)
})