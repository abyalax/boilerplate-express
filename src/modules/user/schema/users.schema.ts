import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { serial, varchar } from 'drizzle-orm/pg-core';
import { Permission } from './permissions.schema';
import { userRoles } from './user-roles.schema';
import { pgTable } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { Role } from './roles.schema';
import { z } from 'zod';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const usersRelations = relations(users, ({ many }) => ({
  userRoles: many(userRoles),
}));

const insertSchema = createInsertSchema(users);
export const userInsertSchema = insertSchema.extend({
  roleId: z.number(),
});

const updateSchema = createUpdateSchema(users);
export const userUpdateSchema = updateSchema.extend({
  roleId: z.number().optional(),
});

export type CreateUser = typeof users.$inferInsert & { roleId: number };
export type UpdateUser = typeof users.$inferInsert & { roleId?: number };

export type BaseUser = Omit<typeof users.$inferSelect, 'password'> & { password?: string };
export type UserSchema = BaseUser & {
  roles: Role[];
  permissions: Permission[];
};
export type User = Omit<UserSchema, 'password'>;
export type UserRoles = {
  id: number;
  name: string;
  password: string;
  email: string;
  userRoles: {
    roleId: number;
    userId: number;
    role: {
      id: number;
      name: string;
      rolePermissions: {
        roleId: number;
        permissionId: number;
        permission: Permission;
      }[];
    };
  }[];
};
export type UserWithPassword = User & {
  password: string;
};
