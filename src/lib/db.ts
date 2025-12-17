import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../drizzle.schema";

// Serverless-optimized connection for Vercel
const connection = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export const db = drizzle(connection, { schema });

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