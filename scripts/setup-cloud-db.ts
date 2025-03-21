import * as fs from 'fs';
import * as path from 'path';
import pkg from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const { Pool } = pkg;

async function setupCloudDatabase() {
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL environment variable is not set.');
    console.error('Please set DATABASE_URL in your .env file before running this script.');
    console.error('Example: DATABASE_URL=postgres://username:password@host:port/database');
    process.exit(1);
  }

  console.log('Setting up cloud database...');
  
  try {
    // Connect to the database
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' 
        ? { rejectUnauthorized: false } 
        : false
    });

    // Read the SQL migration file
    const migrationFilePath = path.join(process.cwd(), 'drizzle', '0000_initial.sql');
    const migrationSQL = fs.readFileSync(migrationFilePath, 'utf-8');

    // Execute the migration
    console.log('Running database migrations...');
    await pool.query(migrationSQL);

    console.log('Database setup completed successfully!');
    
    await pool.end();
  } catch (error) {
    console.error('Error setting up the database:', error);
    process.exit(1);
  }
}

setupCloudDatabase().catch(console.error); 