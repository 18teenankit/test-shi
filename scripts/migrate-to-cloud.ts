import pkg from 'pg';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config();

const { Pool } = pkg;

// Tables to migrate in the correct order (respecting foreign key constraints)
const TABLES = [
  'users',
  'categories',
  'products',
  'product_images',
  'hero_images',
  'contact_requests',
  'settings'
];

async function migrateToCloud() {
  // Check if all required environment variables are set
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL environment variable is not set for cloud database.');
    process.exit(1);
  }

  if (!process.env.LOCAL_DATABASE_URL) {
    console.error('Error: LOCAL_DATABASE_URL environment variable is not set.');
    console.error('Please create an environment variable LOCAL_DATABASE_URL with your local database connection string.');
    console.error('Example: LOCAL_DATABASE_URL=postgres://postgres:Ankit@8511@localhost:5432/my_shivi_db');
    process.exit(1);
  }

  try {
    // Connect to local database
    const localPool = new Pool({
      connectionString: process.env.LOCAL_DATABASE_URL
    });

    // Connect to cloud database
    const cloudPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' 
        ? { rejectUnauthorized: false } 
        : false
    });

    // Migrate each table
    for (const table of TABLES) {
      console.log(`Migrating table: ${table}`);
      
      // Get data from local database
      const { rows } = await localPool.query(`SELECT * FROM ${table}`);
      
      if (rows.length === 0) {
        console.log(`Table ${table} is empty, skipping`);
        continue;
      }
      
      console.log(`Found ${rows.length} rows in ${table}`);
      
      // For each row, insert into cloud database
      for (const row of rows) {
        const columns = Object.keys(row);
        const values = Object.values(row);
        const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
        
        const query = `
          INSERT INTO ${table} (${columns.join(', ')})
          VALUES (${placeholders})
          ON CONFLICT DO NOTHING
        `;
        
        await cloudPool.query(query, values);
      }
      
      console.log(`Successfully migrated ${rows.length} rows to ${table}`);
    }

    console.log('Data migration completed successfully!');
    
    // Close connections
    await localPool.end();
    await cloudPool.end();
    
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

migrateToCloud().catch(console.error); 