const { Pool } = require("pg");
const sqlite3 = require("sqlite3").verbose();
const mongoose = require("mongoose");
const path = require("path");

// Database configuration based on environment
const isDevelopment = process.env.NODE_ENV !== "production";
const isProduction = process.env.NODE_ENV === "production";

let pool;
let dbType = "sqlite"; // default to sqlite

async function initializeDatabase() {
  if (process.env.MONGODB_URI) {
    // MongoDB Configuration
    console.log("🍃 Initializing MongoDB connection...");
    dbType = "mongodb";
    
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("✅ Connected to MongoDB database");
      
      // Import models to ensure they're registered
      const { User, Reservation } = require('./models/mongoose-models');
      await User.createIndexes();
      await Reservation.createIndexes();
      
      return "mongodb";
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error.message);
      throw error;
    }
    
  } else if (isProduction && process.env.DATABASE_URL) {
    // PostgreSQL Configuration
    console.log("🐘 Initializing PostgreSQL connection for production...");
    dbType = "postgresql";
    
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes("localhost") ? false : {
        rejectUnauthorized: false,
      },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Test PostgreSQL connection
    try {
      const client = await pool.connect();
      console.log("✅ Connected to PostgreSQL database");
      client.release();
    } catch (error) {
      console.error("❌ PostgreSQL connection failed:", error.message);
      throw error;
    }

    // PostgreSQL query method with logging
    const originalQuery = pool.query.bind(pool);
    pool.query = async (text, params = []) => {
      const start = Date.now();
      try {
        const res = await originalQuery(text, params);
        const duration = Date.now() - start;
        console.log("📊 Query executed", { duration: `${duration}ms`, rows: res.rowCount });
        return res;
      } catch (error) {
        console.error("❌ Database query error:", error.message);
        throw error;
      }
    };

    return "postgresql";

  } else {
    // SQLite Configuration (Development)
    console.log("🔧 Initializing SQLite connection for development...");
    dbType = "sqlite";
    
    const dbPath = path.join(__dirname, "hotel_reservation.sqlite");
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error("❌ Error opening SQLite database:", err);
        throw err;
      } else {
        console.log("✅ Connected to SQLite database");
      }
    });

    // SQLite query wrapper to match PostgreSQL interface
    pool = {
      query: (sql, params = []) => {
        return new Promise((resolve, reject) => {
          const start = Date.now();
          
          // Handle different SQL syntax between SQLite and PostgreSQL
          let sqliteQuery = sql;
          
          if (sql.includes("RETURNING")) {
            // SQLite doesn't support RETURNING, so we'll handle it differently
            const isInsert = sql.toLowerCase().includes("insert");
            const isUpdate = sql.toLowerCase().includes("update");
            const isDelete = sql.toLowerCase().includes("delete");
            
            sqliteQuery = sql.replace(/RETURNING \*/g, "");
            
            if (isInsert) {
              db.run(sqliteQuery, params, function(err) {
                const duration = Date.now() - start;
                if (err) {
                  console.error("❌ SQLite INSERT error:", err.message);
                  reject(err);
                } else {
                  console.log("📊 Query executed", { duration: `${duration}ms`, rows: this.changes });
                  // Get the inserted row
                  const tableName = sql.match(/INSERT INTO (\w+)/i)?.[1];
                  if (tableName) {
                    db.get(`SELECT * FROM ${tableName} WHERE id = ?`, [this.lastID], (err, row) => {
                      if (err) reject(err);
                      else resolve({ rows: [row], rowCount: this.changes });
                    });
                  } else {
                    resolve({ rows: [{ id: this.lastID }], rowCount: this.changes });
                  }
                }
              });
            } else if (isUpdate || isDelete) {
              // For updates/deletes, we need to get the row before modifying
              const whereMatch = sql.match(/WHERE (.+?)(?:\s+RETURNING|$)/i);
              const tableMatch = sql.match(/(UPDATE|DELETE FROM)\s+(\w+)/i);
              
              if (tableMatch && whereMatch) {
                const tableName = tableMatch[2];
                const whereClause = whereMatch[1];
                
                db.get(`SELECT * FROM ${tableName} WHERE ${whereClause}`, params.slice(-1), (err, originalRow) => {
                  if (err) {
                    console.error("❌ SQLite SELECT error:", err.message);
                    reject(err);
                  } else {
                    db.run(sqliteQuery, params, function(err) {
                      const duration = Date.now() - start;
                      if (err) {
                        console.error("❌ SQLite UPDATE/DELETE error:", err.message);
                        reject(err);
                      } else {
                        console.log("📊 Query executed", { duration: `${duration}ms`, rows: this.changes });
                        resolve({ rows: [originalRow], rowCount: this.changes });
                      }
                    });
                  }
                });
              } else {
                db.run(sqliteQuery, params, function(err) {
                  const duration = Date.now() - start;
                  if (err) {
                    console.error("❌ SQLite error:", err.message);
                    reject(err);
                  } else {
                    console.log("📊 Query executed", { duration: `${duration}ms`, rows: this.changes });
                    resolve({ rows: [], rowCount: this.changes });
                  }
                });
              }
            }
          } else {
            // Regular SELECT queries
            db.all(sqliteQuery, params, (err, rows) => {
              const duration = Date.now() - start;
              if (err) {
                console.error("❌ SQLite SELECT error:", err.message);
                reject(err);
              } else {
                console.log("📊 Query executed", { duration: `${duration}ms`, rows: rows?.length || 0 });
                resolve({ rows: rows || [], rowCount: rows?.length || 0 });
              }
            });
          }
        });
      }
    };

    return "sqlite";
  }
}

// Get database type
function getDatabaseType() {
  return dbType;
}

// Export both the pool and initialization function
module.exports = {
  pool,
  initializeDatabase,
  getDatabaseType
};
