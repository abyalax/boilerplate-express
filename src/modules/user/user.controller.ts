import type { Request } from 'express';
import { userRepository } from './user.repository';
import { eq } from 'drizzle-orm';
import { users } from './schema/users.schema';

export const getProfile = async (req: Request) => {
  return req.user;
};

export const updateProfile = async (req: Request) => {
  const payload = req.body;
  const { id } = req.params;
  console.log('update profile: ', { id, payload });
  return await userRepository.update(eq(users.id, Number(id)), payload);
};
