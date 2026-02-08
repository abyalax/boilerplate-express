import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

export const ErrorZodValidation = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (!err) next()
  if (err instanceof ZodError) {
    const statusCode = err.message.length > 0 ? 400 : 422
    const errors = err.issues.map((error) => ({
      field: error.path.join('.'),
      message: error.message,
    }))
    return res.status(statusCode).json({
      statusCode,
      message: 'Validation Error',
      errors,
    })
  }
}
