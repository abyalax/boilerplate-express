import cookieParser from 'cookie-parser'
import type { CorsOptions } from 'cors'
import cors from 'cors'
import express from 'express'
import { env } from './common/const/credential'
import { handlerException } from './common/middleware/handler.middleware'
import { logRequest } from './common/middleware/log.middleware'
import { ErrorZodValidation } from './common/middleware/zod.middleware'
import { routes } from './routes'

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

app.get('/greet', (req, res) => {
  res.status(200).json({ message: 'Hello' })
})

app.use('/api', routes)

app.use(handlerException)
app.use(ErrorZodValidation)

export default app
