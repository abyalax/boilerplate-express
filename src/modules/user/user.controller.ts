import type { Request } from 'express'
import { userService } from './user.service'

export const getProfile = async (req: Request) => {
  return req.user
}

export const listUser = async (req: Request) => {
  const _params: Record<string, unknown> = req.query

  const castParams = {
    page: Number(_params.page),
    per_page: Number(_params.per_page),
    ..._params,
  }

  const data = await userService.list(castParams)
  return {
    message: 'Success get all users',
    data,
  }
}
