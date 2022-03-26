import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.join(__dirname, '../../', '.env') })
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import reddit from './middleware/reddit'
import routes from './routes'
import express, { ErrorRequestHandler } from 'express'
import RedditError from './utils/RedditError'
const app = express()

app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      'img-src': ['*.redd.it']
    }
  }
}))
app.use(cookieParser(process.env.REACT_APP_COOKIE_SECRET))
app.use(reddit({
  userAgent: process.env.REACT_APP_REDDIT_USERAGENT as string,
  clientId: process.env.REACT_APP_REDDIT_CLIENTID as string,
  clientSecret: process.env.REACT_APP_REDDIT_CLIENTSECRET as string,
  redirectUri: process.env.REACT_APP_REDDIT_REDIRECT_URI as string
}))
app.use(express.json())

console.log('process.env.NODE_ENV:', process.env.NODE_ENV)

const folder = (process.env.NODE_ENV === 'production') ? 'build' : 'public'
const folderPath = path.join(__dirname, '../../react-client', `${folder}`)
console.log('folderPath:', folderPath)
app.use(express.static(folderPath))

app.use(routes)

app.get('/favicon.ico', (_req, res) => res.sendStatus(204))

app.use('*', (_req, res) => {
  res.status(404).send('404: Page Not Found')
})

app.use(((error, _req, res, _next) => {
  if (error instanceof RedditError) {
    console.log(error.message)
    res.sendStatus(error.status)
  } else {
    console.log('express error:', error.message)
    res.sendStatus(500)
  }
}) as ErrorRequestHandler)

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log('server started on port:', port)
})