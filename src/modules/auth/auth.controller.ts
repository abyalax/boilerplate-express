import { NotFoundException, UnauthorizedException } from '~/common/http/exception';
import { users } from '~/common/infrastructure/database/schema';
import { userRepository } from '../user/user.repository';
import { env } from '~/common/const/credential';
import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req: Request) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  return await userRepository.create({
    ...req.body,
    password: hashedPassword,
  });
};

export const login = async (req: Request, res: Response) => {
  const user = await userRepository.rawFind(eq(users.email, req.body.email));
  if (user === undefined) throw new NotFoundException('Email not found');
  const isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid) throw new UnauthorizedException('Password Incorrect');
  const secret = env.JWT_SECRET;
  const access_token = jwt.sign({ id: user.id }, secret, {
    expiresIn: 60 * 60 * 24,
  });
  res.cookie('access_token', access_token, {
    httpOnly: true,
    secure: false,
    signed: true,
    maxAge: 60 * 60 * 24,
  });
  const data = userRepository.flattenRolePermission(user);
  return {
    status: 'success',
    message: 'Login Success',
    data,
  }
};
