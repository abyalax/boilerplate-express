import { eq } from 'drizzle-orm';
import { users } from './schema';
import { db } from '.';

/**
 * This is just for playground 
 * developement query with orm drizzle
 * run with pnpm db:query
 */
async function main() {
  const data = await db.query.users.findFirst({
    where: eq(users.id, 1),
    columns: {
      id: true,
      name: true,
      email: true,
      password: false,
    },
  });
  console.dir(data, { depth: Infinity, colors: true });
  return;
}

main()
  .then(async () => {
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  });
