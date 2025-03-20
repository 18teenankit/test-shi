import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import * as schema from '../shared/schema';

const { Pool } = pkg;

// Create PostgreSQL connection pool using the provided credentials
const pool = new Pool({
  user: 'postgres',
  password: 'Ankit@8511',
  host: 'localhost',
  port: 5432,
  database: 'my_shivi_db',
  ssl: false // Set to true if using SSL
});

// Create a Drizzle ORM instance
export const db = drizzle(pool, { schema });

// Export the pool for direct query access if needed
export const pgPool = pool; 