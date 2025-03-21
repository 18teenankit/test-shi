import pkg from 'pg';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

// Load environment variables
dotenv.config();

const { Pool } = pkg;

async function seedCloudDatabase() {
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL environment variable is not set.');
    console.error('Please set DATABASE_URL in your .env file before running this script.');
    console.error('Example: DATABASE_URL=postgres://username:password@host:port/database');
    process.exit(1);
  }

  console.log('Connecting to cloud database...');
  
  try {
    // Connect to the database
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' 
        ? { rejectUnauthorized: false } 
        : false
    });

    console.log('Connected to cloud database. Seeding initial data...');

    // Create admin user
    const passwordHash = await bcrypt.hash('admin123', 10);
    await pool.query(`
      INSERT INTO users (username, password, role) 
      VALUES ('admin', $1, 'super_admin')
      ON CONFLICT (username) DO NOTHING;
    `, [passwordHash]);
    console.log('Admin user created.');

    // Create sample categories
    const categories = [
      { name: 'Category 1', description: 'Sample category 1', image: '/uploads/category1.jpg' },
      { name: 'Category 2', description: 'Sample category 2', image: '/uploads/category2.jpg' }
    ];

    for (const category of categories) {
      await pool.query(`
        INSERT INTO categories (name, description, image)
        VALUES ($1, $2, $3)
        ON CONFLICT DO NOTHING;
      `, [category.name, category.description, category.image]);
    }
    console.log('Sample categories created.');

    // Create site settings
    const settings = [
      { key: 'site_title', value: 'Shivanshi Enterprises' },
      { key: 'site_description', value: 'Welcome to Shivanshi Enterprises Portal' },
      { key: 'contact_email', value: 'contact@example.com' },
      { key: 'contact_phone', value: '+91 1234567890' }
    ];

    for (const setting of settings) {
      await pool.query(`
        INSERT INTO settings (key, value)
        VALUES ($1, $2)
        ON CONFLICT (key) DO UPDATE SET value = $2;
      `, [setting.key, setting.value]);
    }
    console.log('Site settings created.');

    console.log('Database seeding completed successfully!');
    
    await pool.end();
  } catch (error) {
    console.error('Error seeding the database:', error);
    process.exit(1);
  }
}

seedCloudDatabase().catch(console.error); 