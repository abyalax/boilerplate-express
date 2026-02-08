import type { NextFunction, Request, Response } from 'express'
import { HttpException } from '../http/http.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handlerException = (err: any, _req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) return next(err)
  if (err instanceof HttpException) {
    console.log('⚡️[runtime]: HttpException', err.message)
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    })
  }
  if (typeof err?.code === 'string' && err.code.startsWith('P')) {
    console.log('⚡️[runtime]: PrismaError', err.meta)
    console.log(err.message)
    return res.status(400).json({
      status: 'error',
      message: err.meta,
    })
  }
  console.error('⚡️[runtime]: Unexpected Error ', err.message)
  console.error(err.stack)
  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  })
}
