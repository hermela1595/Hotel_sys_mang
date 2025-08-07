const pool = require("../db");

const createTables = async () => {
  try {
    console.log("🔧 Setting up SQLite database tables...");

    // Create users table (SQLite syntax)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Users table created/verified");

    // Create reservations table (SQLite syntax)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reservations (
        id TEXT PRIMARY KEY,
        user_id INTEGER,
        check_in DATE NOT NULL,
        check_out DATE NOT NULL,
        type VARCHAR(10) CHECK (type IN ('daily', 'weekly', 'monthly')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log("✅ Reservations table created/verified");

    // Create indexes for better performance
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`
    );
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);`
    );
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_reservations_user_id ON reservations(user_id);`
    );
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_reservations_check_in ON reservations(check_in);`
    );
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_reservations_check_out ON reservations(check_out);`
    );

    console.log("✅ Database indexes created/verified");
    console.log("🎉 SQLite database setup completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error setting up database:", error);
    process.exit(1);
  }
};

createTables();
