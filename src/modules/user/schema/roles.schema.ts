import { rolePermissions } from './role-permissions.schema';
import { serial, varchar } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { userRoles } from './user-roles.schema';
import { relations } from 'drizzle-orm';

export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: varchar({ length: 100 }).notNull().unique(),
});

export type Role = typeof roles.$inferSelect;

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
  rolePermissions: many(rolePermissions),
}));
