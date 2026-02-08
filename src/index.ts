import { ErrorZodValidation } from './common/middleware/zod.middleware'
import { handlerException } from './common/middleware/handler.middleware'
import { logRequest } from './common/middleware/log.middleware'
import { env } from './common/const/credential'
import type { CorsOptions } from 'cors'
import cookieParser from 'cookie-parser'
import { routes } from './routes'
import express from 'express'
import cors from 'cors'
import { User } from 'generated/prisma/client'

declare module 'express' {
  interface Request {
    user?: User
  }
}

const corsOption: CorsOptions = {
  origin: env.CORS_ORIGIN,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}

const app = express()
app.use(cookieParser(env.COOKIE_SECRET))
app.use(cors(corsOption))
app.use(express.json())
app.use(logRequest)

app.use('/api', routes)

app.use(handlerException)
app.use(ErrorZodValidation)

const PORT = 4000
app.listen(PORT, () => {
  console.log(`⚡[express]: Application running in http://localhost:${PORT}!`)
})
