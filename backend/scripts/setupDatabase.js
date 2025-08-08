const pool = require("../db");

const createTables = async () => {
  try {
    console.log("🔧 Setting up SQLite database tables...");

    // Create hotels table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hotels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        country VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL,
        stars INTEGER DEFAULT 3 CHECK (stars >= 1 AND stars <= 5),
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Hotels table created/verified");

    // Create rooms table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hotel_id INTEGER NOT NULL,
        room_number VARCHAR(10) NOT NULL,
        room_type VARCHAR(50) NOT NULL,
        price_per_night DECIMAL(10,2) NOT NULL,
        capacity INTEGER NOT NULL,
        amenities TEXT,
        description TEXT,
        is_available BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
        UNIQUE(hotel_id, room_number)
      );
    `);
    console.log("✅ Rooms table created/verified");

    // Check if users table exists and has the new columns
    const userSchema = await pool.query("PRAGMA table_info(users);");
    const hasFirstName = userSchema.rows.some(
      (col) => col.name === "first_name"
    );

    if (!hasFirstName) {
      console.log("🔄 Updating users table schema...");

      // Create new users table with name columns
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          phone VARCHAR(20) UNIQUE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Copy existing data to new table (setting default names for existing users)
      await pool.query(`
        INSERT INTO users_new (id, first_name, last_name, email, phone, created_at)
        SELECT id, 'Guest', 'User', email, phone, created_at 
        FROM users;
      `);

      // Drop old table and rename new one
      await pool.query("DROP TABLE users;");
      await pool.query("ALTER TABLE users_new RENAME TO users;");

      console.log("✅ Users table updated with name fields");
    } else {
      console.log("✅ Users table already has name fields");
    }

    // Check if reservations table exists and has the new columns
    const reservationSchema = await pool.query(
      "PRAGMA table_info(reservations);"
    );
    const hasRoomId = reservationSchema.rows.some(
      (col) => col.name === "room_id"
    );

    if (!hasRoomId) {
      console.log("🔄 Updating reservations table schema...");

      // Create new reservations table with all columns
      await pool.query(`
        CREATE TABLE IF NOT EXISTS reservations_new (
          id TEXT PRIMARY KEY,
          user_id INTEGER,
          room_id INTEGER,
          hotel_id INTEGER,
          check_in DATE NOT NULL,
          check_out DATE NOT NULL,
          total_price DECIMAL(10,2),
          status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
          type VARCHAR(10) CHECK (type IN ('daily', 'weekly', 'monthly')),
          guest_count INTEGER DEFAULT 1,
          special_requests TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
          FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
        );
      `);

      // Copy existing data to new table
      await pool.query(`
        INSERT INTO reservations_new (id, user_id, check_in, check_out, type, created_at)
        SELECT id, user_id, check_in, check_out, type, created_at 
        FROM reservations;
      `);

      // Drop old table and rename new one
      await pool.query("DROP TABLE reservations;");
      await pool.query("ALTER TABLE reservations_new RENAME TO reservations;");

      console.log("✅ Reservations table updated with new schema");
    } else {
      console.log("✅ Reservations table already has updated schema");
    }

    // Create indexes for better performance
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_hotels_city ON hotels(city);`
    );
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_hotels_country ON hotels(country);`
    );
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_hotels_stars ON hotels(stars);`
    );
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_rooms_hotel_id ON rooms(hotel_id);`
    );
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_rooms_type ON rooms(room_type);`
    );
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_rooms_price ON rooms(price_per_night);`
    );
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_rooms_available ON rooms(is_available);`
    );
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
      `CREATE INDEX IF NOT EXISTS idx_reservations_room_id ON reservations(room_id);`
    );
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_reservations_hotel_id ON reservations(hotel_id);`
    );
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_reservations_check_in ON reservations(check_in);`
    );
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_reservations_check_out ON reservations(check_out);`
    );
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);`
    );

    console.log("✅ Database indexes created/verified");

    // Insert sample hotels
    await pool.query(`
      INSERT OR IGNORE INTO hotels (id, name, address, city, country, phone, email, stars, description)
      VALUES 
        (1, 'Grand Plaza Hotel', '123 Main Street', 'New York', 'USA', '+1-555-0100', 'info@grandplaza.com', 5, 'Luxury hotel in the heart of Manhattan'),
        (2, 'Seaside Resort', '456 Ocean Drive', 'Miami', 'USA', '+1-555-0200', 'reservations@seaside.com', 4, 'Beautiful beachfront resort with ocean views'),
        (3, 'Mountain View Lodge', '789 Alpine Way', 'Denver', 'USA', '+1-555-0300', 'contact@mountainview.com', 3, 'Cozy lodge with stunning mountain views'),
        (4, 'City Center Inn', '321 Business Blvd', 'Chicago', 'USA', '+1-555-0400', 'info@citycenter.com', 4, 'Modern hotel perfect for business travelers');
    `);
    console.log("✅ Sample hotels inserted");

    // Insert sample rooms
    await pool.query(`
      INSERT OR IGNORE INTO rooms (hotel_id, room_number, room_type, price_per_night, capacity, amenities, description, is_available)
      VALUES 
        (1, '101', 'Standard', 150.00, 2, 'WiFi, TV, AC, Mini Bar', 'Comfortable standard room with city view', 1),
        (1, '201', 'Deluxe', 250.00, 2, 'WiFi, TV, AC, Mini Bar, Balcony', 'Spacious deluxe room with balcony', 1),
        (1, '301', 'Suite', 450.00, 4, 'WiFi, TV, AC, Mini Bar, Kitchen, Living Area', 'Luxury suite with separate living area', 1),
        (2, '101', 'Ocean View', 200.00, 2, 'WiFi, TV, AC, Ocean View, Balcony', 'Room with stunning ocean views', 1),
        (2, '102', 'Beach Front', 300.00, 3, 'WiFi, TV, AC, Beach Access, Balcony', 'Direct beach access from your room', 1),
        (3, '201', 'Mountain View', 120.00, 2, 'WiFi, TV, Fireplace, Mountain View', 'Cozy room with mountain views', 1),
        (3, '202', 'Family Suite', 180.00, 4, 'WiFi, TV, Fireplace, Kitchen, Mountain View', 'Perfect for families visiting the mountains', 1),
        (4, '101', 'Business', 130.00, 1, 'WiFi, TV, AC, Desk, Business Center Access', 'Designed for business travelers', 1),
        (4, '201', 'Executive', 200.00, 2, 'WiFi, TV, AC, Desk, Meeting Room Access', 'Executive room with premium amenities', 1);
    `);
    console.log("✅ Sample rooms inserted");

    console.log("🎉 SQLite database setup completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error setting up database:", error);
    process.exit(1);
  }
};

createTables();
