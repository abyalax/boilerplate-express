import { Permissions, Role, RolePermissions, User } from 'generated/prisma/client'

export type UserWithRelations = User & {
  user_roles: {
    role: {
      role_permissions: ({
        permission: Permissions
      } & RolePermissions)[]
    } & Role
  }[]
}

export const UserMapper = {
  toDTO: (user: UserWithRelations) => {
    const roles: Role[] = []
    const permissionsMap = new Map<number, Permissions>()

    user.user_roles.forEach((ur) => {
      const role = ur.role
      roles.push({
        id: role.id,
        name: role.name,
      })

      role.role_permissions.forEach((rp) => {
        const p = rp.permission
        if (!permissionsMap.has(p.id)) {
          permissionsMap.set(p.id, {
            id: p.id,
            key: p.key,
            name: p.name,
          })
        }
      })
    })

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      roles,
      permissions: Array.from(permissionsMap.values()),
    }
  },
}
