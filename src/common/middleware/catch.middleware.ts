import type { Request, Response } from 'express'

export const catchMethodNotAllowed = async (req: Request, res: Response) => {
  console.log('catchMethodNotAllowed running...')
  return res.json({
    statusCode: 405,
    message: `Method ${req.method} not allowed on ${req.originalUrl}`,
  })
}
