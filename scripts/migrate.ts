import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/drizzle.schema';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function runMigration() {
  try {
    console.log('Running migration...');
    
    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'drizzle', '0002_public_thanos.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
    
    // Split and execute statements
    const statements = migrationSQL.split('--> statement-breakpoint').map(s => s.trim()).filter(s => s);
    
    for (const statement of statements) {
      console.log('Executing statement:', statement.substring(0, 100) + '...');
      await sql.query(statement);
    }
    
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

runMigration().catch(console.error);