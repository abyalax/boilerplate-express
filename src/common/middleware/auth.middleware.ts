import type { NextFunction, Request, Response } from 'express'
import { UnauthorizedException } from '../http/exception'
import { env } from '../const/credential'
import jwt from 'jsonwebtoken'
import { userService } from '~/modules/user/user.service'

export const AuthMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  console.log('📍 [AuthMiddleware] checking...')
  // const { authorization } = req.headers;
  // const token = authorization.split(' ')[1];

  const token = req.signedCookies.access_token
  console.log('signedCookies: ', token)

  if (!token) throw new UnauthorizedException('Token Not Found')
  const secret = env.JWT_SECRET
  const jwtDecoded = jwt.verify(token, secret) as { id: string }
  if (!jwtDecoded) throw new UnauthorizedException('Token Invalid')
  const user = await userService.findUser({
    id: Number(jwtDecoded.id),
  })
  req.user = user
  next()
}
