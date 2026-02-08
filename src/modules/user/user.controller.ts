import type { Request } from 'express'

export const getProfile = async (req: Request) => {
  return req.user
}
