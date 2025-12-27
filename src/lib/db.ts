import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "@/drizzle.schema";

// Ensure env vars are loaded if running in script context
if (!process.env.DATABASE_URL && typeof window === 'undefined') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const dotenv = require('dotenv');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path');
    dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
  } catch {
    // Ignore error if dotenv is not available or fails
  }
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

// Helper function for database operations with retry logic
export async function withDatabase<T>(
  operation: () => Promise<T>,
  retries = 3
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0 && error instanceof Error) {
      console.warn(`Database operation failed, retrying... (${3 - retries + 1}/3)`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return withDatabase(operation, retries - 1);
    }
    throw error;
  }
}