import { NotFoundException, UnauthorizedException } from '~/common/http/exception'
import { env } from '~/common/const/credential'
import { Request, Response } from 'express'
import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { userService } from '../user/user.service'

export const register = async (req: Request) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  return await userService.create({
    ...req.body,
    password: hashedPassword,
    user_roles: {
      create: {
        role: {
          connect: {
            id: 1,
          },
        },
      },
    },
  })
}

export const login = async (req: Request, res: Response) => {
  if (req.body?.email && req.body?.password) {
    const userRepository = userService._getRepository()
    const user = await userRepository.findWithRolesAndPermissions({
      email: req.body.email,
    })
    if (user === undefined) throw new NotFoundException('User not found')
    const isValid = await bcrypt.compare(req.body.password, user.password)
    if (!isValid) throw new UnauthorizedException('Invalid Password')
    const secret = env.JWT_SECRET
    const access_token = jwt.sign({ id: user.id }, secret, {
      expiresIn: 60 * 60 * 24,
    })
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false,
      signed: true,
      maxAge: 60 * 60 * 24,
    })
    return {
      status: 'success',
      message: 'Login Success',
      data: user,
    }
  } else {
    throw new UnauthorizedException()
  }
}
