import { betterAuth } from 'better-auth';
import pg from 'pg';

const { Pool } = pg;

export const auth = betterAuth({
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  emailAndPassword: { enabled: true },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [process.env.FRONTEND_URL || 'http://localhost:3000'],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
});
