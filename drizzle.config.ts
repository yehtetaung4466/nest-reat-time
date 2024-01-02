import { defineConfig } from 'drizzle-kit';
import doenv from 'dotenv';
doenv.config();
export default defineConfig({
  schema: './src/drizzle/schema.ts',
  driver: 'pg',
  out: './drizzle',
  dbCredentials: {
    connectionString: process.env.DB_URL,
  },
});
