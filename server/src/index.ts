import { env } from './envConfig.js'
import morgan from 'morgan'
import helmet from 'helmet'
import routes from './routes.js'
import createError from 'http-errors'
import { ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'
import express, { ErrorRequestHandler } from 'express'
const app = express()

console.log('NODE_ENV:', env.NODE_ENV)

app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path} - started`)
  next()
})
app.use(morgan('dev'))
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      // eslint-disable-next-line quotes
      defaultSrc: ["'self'", '*.reddit.com'],
      // eslint-disable-next-line quotes
      imgSrc: ["'self'", '*.redd.it', '*.imgur.com']
    }
  }
}))
app.use(express.json())
app.use(routes)

const folderPath = `${new URL('../../client', import.meta.url).pathname}/dist`
app.use(express.static(folderPath))

app.get('/*', (req, res, next) => {
  try {
    res.sendFile(`${folderPath}/index.html`)
  } catch (error) {
    next(error)
  }
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(((error, _req, res, _next) => {
  if (error instanceof ZodError) {
    console.log(fromZodError(error).message)
    res.sendStatus(400)
  } else if (createError.isHttpError(error)) {
    console.log(`${error.name}: ${error.message}`)
    res.sendStatus(error.status)
  } else {
    console.log('express error:', error.message)
    res.sendStatus(500)
  }
}) as ErrorRequestHandler)

const port = env.PORT || 5000
app.listen(port, () => {
  console.log('server started on port:', port)
})