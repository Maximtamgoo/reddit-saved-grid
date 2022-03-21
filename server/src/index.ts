import 'dotenv/config'
import helmet from 'helmet'
import path from 'path'
import cookieParser from 'cookie-parser'
import reddit from './middleware/reddit'
import routes from './routes'
import express, { ErrorRequestHandler } from 'express'
const app = express()

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'img-src': ['"self"', '*.redd.it']
    }
  }
}))
app.use(cookieParser(process.env.REACT_APP_COOKIE_SECRET))
app.use(reddit({
  userAgent: process.env.REACT_APP_REDDIT_USERAGENT,
  clientId: process.env.REACT_APP_REDDIT_CLIENTID,
  clientSecret: process.env.REACT_APP_REDDIT_CLIENTSECRET,
  redirectUri: process.env.REACT_APP_REDDIT_REDIRECT_URI
}))
app.use(express.json())

console.log('process.env.NODE_ENV:', process.env.NODE_ENV)

const folder = (process.env.NODE_ENV === 'production') ? 'build' : 'public'
const indexPath = path.join(__dirname, '../', `${folder}/index.html`)
app.use(express.static(folder))

app.use(routes)

app.get('/favicon.ico', (_req, res) => res.sendStatus(204))

app.get('/*', (req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  try {
    res.sendFile(indexPath)
  } catch (error) {
    next(error)
  }
})

app.use('*', (_req, res) => {
  res.status(404).send('404: Page Not Found')
})

const errorMW: ErrorRequestHandler = (error, _req, res, _next) => {
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
}

app.use(errorMW)

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log('server started on port:', port)
})