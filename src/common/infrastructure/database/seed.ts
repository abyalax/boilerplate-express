import * as schema from './schema';
import bcrypt from 'bcrypt';
import { db } from '.';

async function main() {
  console.log('⚡ Seeding deterministic roles/permissions...');

  // reset data agar id diulang dari 1
  await db.execute(`
    TRUNCATE TABLE 
      "role_permissions",
      "user_roles",
      "users",
      "permissions",
      "roles"
    RESTART IDENTITY CASCADE;
  `);

  // --- insert roles ---
  const insertedRoles = await db
    .insert(schema.roles)
    .values([{ name: 'Customer' }, { name: 'Client Admin' }, { name: 'System Admin' }])
    .returning();

  const roleIds = Object.fromEntries(insertedRoles.map((r) => [r.name, r.id]));

  // --- insert permissions ---
  const insertedPermissions = await db
    .insert(schema.permissions)
    .values([
      { key: 'customer:read_profile', name: 'Customer Read Profile' },
      { key: 'customer:create_order', name: 'Customer Create Order' },
      { key: 'customer:read_order', name: 'Customer Read Order' },
      { key: 'customer:update_order', name: 'Customer Update Order' },
      { key: 'customer:delete_order', name: 'Customer Delete Order' },

      { key: 'customer:create', name: 'Create Customer' },
      { key: 'customer:read', name: 'Read Customer' },
      { key: 'customer:update', name: 'Update Customer' },
      { key: 'customer:delete', name: 'Delete Customer' },
      { key: 'customer:*', name: 'Manage Customer' },

      { key: 'client:read', name: 'Read Client' },
      { key: 'client:create', name: 'Create Client' },
      { key: 'client:update', name: 'Update Client' },
      { key: 'client:delete', name: 'Delete Client' },
      { key: 'client:*', name: 'Manage Client' },
    ])
    .returning();

  const permissionIds = Object.fromEntries(insertedPermissions.map((p) => [p.key, p.id]));

  // --- insert users ---
  const [cutsomerPass, clientPass, adminPass] = await Promise.all([
    bcrypt.hash('customer_pass', 10),
    bcrypt.hash('client_pass', 10),
    bcrypt.hash('admin_pass', 10),
  ]);

  const insertedUsers = await db
    .insert(schema.users)
    .values([
      { name: 'Customer', email: 'customer@gmail.com', password: cutsomerPass },
      { name: 'Client Admin', email: 'client@gmail.com', password: clientPass },
      { name: 'System Admin', email: 'admin@gmail.com', password: adminPass },
    ])
    .returning();

  const userIds = Object.fromEntries(insertedUsers.map((u) => [u.email, u.id]));

  // --- map userRoles ---
  await db.insert(schema.userRoles).values([
    { userId: userIds['customer@gmail.com'], roleId: roleIds['Customer'] },
    { userId: userIds['client@gmail.com'], roleId: roleIds['Client Admin'] },
    { userId: userIds['admin@gmail.com'], roleId: roleIds['System Admin'] },
  ]);

  // --- map rolePermissions ---
  await db.insert(schema.rolePermissions).values([
    { roleId: roleIds['Customer'], permissionId: permissionIds['customer:read_profile'] },
    { roleId: roleIds['Customer'], permissionId: permissionIds['customer:create_order'] },
    { roleId: roleIds['Customer'], permissionId: permissionIds['customer:update_order'] },
    { roleId: roleIds['Customer'], permissionId: permissionIds['customer:delete_order'] },

    { roleId: roleIds['Client Admin'], permissionId: permissionIds['customer:*'] },

    { roleId: roleIds['System Admin'], permissionId: permissionIds['customer:*'] },
    { roleId: roleIds['System Admin'], permissionId: permissionIds['client:*'] },
  ]);

  console.log('✅ Seeding User roles/permissions done!');
}
main()
  .then(async () => {
    console.log('✅ Seed data successfully created');
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  });
