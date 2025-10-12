import { BaseUser, CreateUser, Permission, Role, UpdateUser, User, UserRoles, userRoles, users } from '~/common/infrastructure/database/schema';
import { UnprocessableEntity } from '~/common/http/exception';
import { db } from '~/common/infrastructure/database';
import { eq, SQL } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

class UserRepository {
  async findById(id: number): Promise<User | undefined> {
    return await this.find(eq(users.id, id));
  }

  async create(payload: CreateUser): Promise<BaseUser> {
    const userExist = await this.baseFind(eq(users.email, payload.email));
    if (userExist) throw new UnprocessableEntity('Email already exist');
    const hashed = await bcrypt.hash(payload.password, 10);
    return await db.transaction(async (tx) => {
      const [inserted] = await tx
        .insert(users)
        .values({
          email: payload.email,
          name: payload.name,
          password: hashed,
        })
        .returning();

      await tx.insert(userRoles).values({
        userId: inserted.id,
        roleId: payload.roleId ?? 1,
      });

      return inserted;
    });
  }

  async update(whereClause: SQL, payload: UpdateUser): Promise<BaseUser> {
    const [updated] = await db
      .update(users)
      .set({
        ...payload,
      })
      .where(whereClause)
      .returning();
    return updated;
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await db.delete(users).where(eq(users.id, id));
    return deleted.rowCount !== null;
  }

  async rawFind(whereClause: SQL): Promise<UserRoles | undefined> {
    return await db.query.users.findFirst({
      where: whereClause,
      with: {
        userRoles: {
          with: {
            role: {
              columns: { id: true, name: true },
              with: {
                rolePermissions: {
                  with: {
                    permission: {
                      columns: { id: true, key: true, name: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async find(whereClause: SQL): Promise<User | undefined> {
    const user: UserRoles | undefined = await this.rawFind(whereClause);
    if (user === undefined) return undefined;
    return this.flattenRolePermission(user);
  }

  async baseFind(whereClause: SQL): Promise<BaseUser | undefined> {
    return await db.query.users.findFirst({
      where: whereClause,
      columns: {
        id: true,
        name: true,
        email: true,
        password: false,
      },
    });
  }

  flattenRolePermission(user: UserRoles): User {
    const rolesArray: Role[] = [];
    const permissionsMap = new Map<number, Permission>();
    user.userRoles.forEach((ur) => {
      const role = ur.role;
      rolesArray.push({ id: role.id, name: role.name });
      role.rolePermissions.forEach((rp) => {
        const p = rp.permission;
        if (!permissionsMap.has(p.id)) {
          permissionsMap.set(p.id, { id: p.id, key: p.key, name: p.name });
        }
      });
    });
    const permissionsArray = Array.from(permissionsMap.values());
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: rolesArray,
      permissions: permissionsArray,
    };
  }
}

export const userRepository = new UserRepository();
