const { Pool } = require('pg');
require('dotenv').config();

async function setupPostgreSQLDatabase() {
  console.log('🚀 Setting up PostgreSQL database...');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is required');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost') ? false : {
      rejectUnauthorized: false
    }
  });

  try {
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Connected to PostgreSQL database');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created/verified');

    // Create reservations table with UUID support
    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      CREATE TABLE IF NOT EXISTS reservations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        check_in DATE NOT NULL,
        check_out DATE NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('daily', 'weekly', 'monthly')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Reservations table created/verified');

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
      CREATE INDEX IF NOT EXISTS idx_reservations_user_id ON reservations(user_id);
      CREATE INDEX IF NOT EXISTS idx_reservations_check_in ON reservations(check_in);
      CREATE INDEX IF NOT EXISTS idx_reservations_check_out ON reservations(check_out);
      CREATE INDEX IF NOT EXISTS idx_reservations_type ON reservations(type);
    `);
    console.log('✅ Database indexes created/verified');

    // Verify tables exist
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'reservations')
    `);
    
    console.log('📊 Database tables:', tablesResult.rows.map(row => row.table_name));
    
    if (tablesResult.rows.length === 2) {
      console.log('🎉 PostgreSQL database setup completed successfully!');
    } else {
      console.log('⚠️ Some tables may not have been created properly');
    }

  } catch (error) {
    console.error('❌ Error setting up PostgreSQL database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  setupPostgreSQLDatabase()
    .then(() => {
      console.log('✅ Database setup complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Database setup failed:', error);
      process.exit(1);
    });
}

module.exports = setupPostgreSQLDatabase;
