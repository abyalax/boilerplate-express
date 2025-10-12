import { configDotenv } from 'dotenv';
import z from 'zod';

configDotenv();

const envSchema = z.object({
  CORS_ORIGIN: z.string().min(1, 'CORS_ORIGIN is required'),
  COOKIE_SECRET: z.string().min(1, 'COOKIE_SECRET is required'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),

  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),
});

export const env = envSchema.parse(process.env);
