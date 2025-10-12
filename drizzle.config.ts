import { defineConfig } from 'drizzle-kit';
import { env } from './src/common/const/credential';

export default defineConfig({
  out: './drizzle',
  schema: './src/**/*.schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
