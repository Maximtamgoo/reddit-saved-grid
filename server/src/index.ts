// import path from 'path'
// import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import reddit from './middleware/reddit'
import routes from './routes'
import express, { ErrorRequestHandler } from 'express'
import RedditError from './utils/RedditError'
import cors from 'cors'
const app = express()

app.set('trust proxy', 1)
// app.use(helmet())
app.use(cors({ origin: process.env.REACT_CLIENT_DOMAIN, credentials: true }))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(reddit({
  userAgent: process.env.REDDIT_USERAGENT as string,
  clientId: process.env.REDDIT_CLIENTID as string,
  clientSecret: process.env.REDDIT_CLIENT_SECRET as string,
  redirectUri: process.env.REDDIT_REDIRECT_URI as string
}))
app.use(express.json())

console.log('process.env.NODE_ENV:', process.env.NODE_ENV)

// const folder = (process.env.NODE_ENV === 'production') ? 'build' : 'public'
// const folderPath = path.join(__dirname, '../../react-client', `${folder}`)
// console.log('folderPath:', folderPath)
// app.use(express.static(folderPath))

app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

app.use(routes)

// app.get('/*', (req, res, next) => {
//   console.log(`${req.method} ${req.path}`)
//   try {
//     res.sendFile(`${folderPath}/index.html`)
//   } catch (error) {
//     next(error)
//   }
// })

// app.use('*', (_req, res) => {
//   res.status(404).send('404: Page Not Found')
// })

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