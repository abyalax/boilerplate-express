import { rolePermissions } from '~/common/infrastructure/database/schema';
import { serial, varchar } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const permissions = pgTable('permissions', {
  id: serial('id').primaryKey(),
  key: varchar({ length: 100 }).notNull().unique(),
  name: varchar({ length: 100 }).notNull(),
});

export type Permission = typeof permissions.$inferSelect;

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));
