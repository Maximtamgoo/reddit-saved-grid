import dotenv from 'dotenv'
dotenv.config({ path: `${new URL('../../', import.meta.url).pathname}.env.${process.env.NODE_ENV}` })
import { z } from 'zod'

const Schema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  PORT: z.string(),

  REDDIT_USERAGENT: z.string(),
  REDDIT_CLIENTID: z.string(),
  REDDIT_CLIENT_SECRET: z.string(),
  REDDIT_REDIRECT_URI: z.string()
})

const result = Schema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,

  REDDIT_USERAGENT: process.env.REDDIT_USERAGENT,
  REDDIT_CLIENTID: process.env.REDDIT_CLIENTID,
  REDDIT_CLIENT_SECRET: process.env.REDDIT_CLIENT_SECRET,
  REDDIT_REDIRECT_URI: process.env.REDDIT_REDIRECT_URI
})

if (!result.success) {
  console.log('Invalid environment variables:')
  const entries = Object.entries(result.error.format())
  entries.forEach(([key, val]) => {
    if ('_errors' in val) {
      console.log(`${key}: ${val._errors.join(', ')}`)
    }
  })
  process.exit(1)
}

export const env = result.data