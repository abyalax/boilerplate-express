import { Prisma } from 'generated/prisma/client'
import { UserRepository } from './user.repository'
import { Service } from '~/libs/abstraction/services'

class UserService extends Service<UserRepository> {
  constructor() {
    super(new UserRepository())
  }
  _getRepository = () => this.repository
  _getModel = () => this._getModel

  paginateUsers(page: number, per_page: number) {
    return this.repository.paginate({
      page,
      per_page,
    })
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
