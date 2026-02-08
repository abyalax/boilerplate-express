import { Prisma, User } from 'generated/prisma/client'
import { MetaRequest } from '~/common/types/meta'
import { Service } from '~/libs/abstraction/services'
import { UserMapper, UserWithRelations } from './user.map'
import { UserRepository } from './user.repository'

class UserService extends Service<UserRepository> {
  constructor() {
    super(new UserRepository())
  }
  _getRepository = () => this.repository
  _getModel = () => this._getModel

  async list(params: MetaRequest<User>, where?: Prisma.UserWhereInput) {
    const { page, per_page, search, sort_by, sort_order } = params
    const cacheKey = JSON.stringify(params)

    if (this.repository.cache) {
      const cached = await this.repository.cache.get(cacheKey)
      if (cached) return cached
    }

    const data = await this.repository.paginate<UserWithRelations, Prisma.UserInclude>({
      page,
      per_page,
      where,
      order_by: {
        [sort_by as string]: sort_order,
      },
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
      search: {
        term: search,
        fields: ['name', 'email'],
        mapper: {
          name: (term) => ({
            name: { contains: term, mode: 'insensitive' },
          }),
          email: (term) => ({
            email: { contains: term, mode: 'insensitive' },
          }),
        },
      },
    })

    const mapped = data.items.map((e) => UserMapper.toDTO(e))
    const result = {
      items: mapped,
      meta: data.meta,
    }

    if (this.repository.cache) {
      await this.repository.cache.set(cacheKey, result, { ttl: 600 })
    }
    return result
  }

  findByEmail(email: string) {
    return this.repository.findByEmail(email)
  }

  findUser(where: Prisma.UserWhereUniqueInput) {
    return this.repository.findWithRolesAndPermissions(where)
  }

  create(data: Prisma.UserCreateInput) {
    return this.repository.create(0, data)
  }
}

export const userService = new UserService()
