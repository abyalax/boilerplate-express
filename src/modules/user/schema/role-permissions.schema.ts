import { roles } from '~/common/infrastructure/database/schema';
import { pgTable, primaryKey, integer } from 'drizzle-orm/pg-core';
import { permissions } from './permissions.schema';
import { relations } from 'drizzle-orm';

export const rolePermissions = pgTable(
  'role_permissions',
  {
    roleId: integer().notNull(),
    permissionId: integer().notNull(),
  },
  (table) => [primaryKey({ columns: [table.roleId, table.permissionId] })],
);

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.roleId],
    references: [roles.id],
  }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id],
  }),
}));
