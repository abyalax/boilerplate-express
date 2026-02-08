import { Prisma } from 'generated/prisma/client'
import { Repository } from '~/libs/abstraction/repositories'
import { prisma } from '~/libs/db/prisma'
import { UserMapper } from './user.map'

export class UserRepository extends Repository<Prisma.UserDelegate, Prisma.UserWhereInput, Prisma.UserOrderByWithRelationInput> {
  constructor() {
    super(prisma.user)
  }

  _getModel() {
    return this.model
  }

  findByEmail(email: string) {
    return this.model.findUniqueOrThrow({
      where: { email },
    })
  }

  async findWithRolesAndPermissions(where: Prisma.UserWhereUniqueInput) {
    const user = await prisma.user.findUniqueOrThrow({
      where,
      include: {
        user_roles: {
          include: {
            role: {
              include: {
                role_permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    })
    return UserMapper.toDTO(user)
  }
}
