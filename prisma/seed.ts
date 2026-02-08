import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

import 'dotenv/config'
import { userSeeder } from './seeds/user-seeder'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
})

async function main() {
  console.log('⚡ Seeding deterministic data...')
  await userSeeder()
}

main()
  .then(() => {
    console.log('✅ Seed data successfully created')
    prisma.$disconnect()
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    prisma.$disconnect()
    process.exit(1)
  })
