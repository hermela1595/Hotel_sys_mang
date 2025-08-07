const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Create SQLite database file in the backend directory
const dbPath = path.join(__dirname, "hotel_reservation.sqlite");

// Create connection to SQLite
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Database connection error:", err);
  } else {
    console.log("✅ Connected to SQLite database");
  }
});

// Wrapper to make SQLite work with async/await like PostgreSQL
const pool = {
  query: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      // Convert PostgreSQL-style $1, $2 to SQLite-style ?
      const sqliteSql = sql.replace(/\$\d+/g, "?");

      if (sqliteSql.trim().toUpperCase().startsWith("SELECT")) {
        db.all(sqliteSql, params, (err, rows) => {
          if (err) reject(err);
          else resolve({ rows });
        });
      } else {
        db.run(sqliteSql, params, function (err) {
          if (err) reject(err);
          else {
            // Return inserted row data for INSERT statements
            if (sqliteSql.trim().toUpperCase().startsWith("INSERT")) {
              const selectSql = sqliteSql.includes("users")
                ? "SELECT * FROM users WHERE id = ?"
                : "SELECT * FROM reservations WHERE id = ?";
              const id = sqliteSql.includes("users") ? this.lastID : params[0];

              db.get(selectSql, [id], (err, row) => {
                if (err) reject(err);
                else resolve({ rows: [row] });
              });
            } else {
              resolve({ rows: [] });
            }
          }
        });
      }
    });
  },
};

module.exports = pool;
