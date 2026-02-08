/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextFunction, Request, Response } from 'express'

export type Handler = (req: Request, res: Response, next: NextFunction) => Promise<unknown> | any

export const withResponse = (handler: Handler): Handler => {
  return async (req, res, next) => {
    try {
      const result = await handler(req, res, next)
      if (res.headersSent) return
      if (result === undefined) {
        console.log('📍[server]: detect middleware')
        return
      }
      let statusCode = 200
      let status = 'success'
      let message = 'Success'
      let data = result
      let pagination = undefined

      if ('statusCode' in result) statusCode = result.statusCode
      if ('status' in result) status = result.status
      if ('message' in result) message = result.message
      if ('data' in result) data = result.data
      if ('pagination' in result) pagination = result.pagination

      if (data && typeof data === 'object' && !Array.isArray(data)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { statusCode: _, ...rest } = data
        data = rest
      }

      console.log('⚡️[runtime]: response: ', result.message ?? message)
      res.status(statusCode).json({
        status,
        message,
        data,
        pagination,
      })
    } catch (err) {
      next(err)
    }
  }
}
