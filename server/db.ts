import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import * as schema from '../shared/schema';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const { Pool } = pkg;

// Parse the database URL from environment variable or use fallback configuration
const getDbConfig = () => {
  if (process.env.DATABASE_URL) {
    return { 
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };
  }
  
  // Fallback to local configuration
  return {
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'Ankit@8511',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'my_shivi_db',
    ssl: process.env.DB_SSL === 'true'
  };
};

// Create PostgreSQL connection pool using the provided credentials
const pool = new Pool(getDbConfig());

// Create a Drizzle ORM instance
export const db = drizzle(pool, { schema });

// Export the pool for direct query access if needed
export const pgPool = pool; 