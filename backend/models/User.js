const pool = require("../db");

// Create a new user
exports.createUser = async (firstName, lastName, email, phone) => {
  try {
    const result = await pool.query(
      "INSERT INTO users (first_name, last_name, email, phone) VALUES (?, ?, ?, ?) RETURNING *",
      [firstName, lastName, email, phone]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

// Find user by phone number
exports.findUserByPhone = async (phone) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE phone = ?", [
      phone,
    ]);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error finding user by phone: ${error.message}`);
  }
};

// Find user by email
exports.findUserByEmail = async (email) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error finding user by email: ${error.message}`);
  }
};

// Find user by ID
exports.findUserById = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error finding user by ID: ${error.message}`);
  }
};

// Get all users
exports.getAllUsers = async () => {
  try {
    const result = await pool.query(
      "SELECT * FROM users ORDER BY created_at DESC"
    );
    return result.rows;
  } catch (error) {
    throw new Error(`Error getting all users: ${error.message}`);
  }
};
