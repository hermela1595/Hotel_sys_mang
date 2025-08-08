const pool = require("../db");
const { v4: uuidv4 } = require("uuid");

// Create a new r// Delete reservation
exports.deleteReservation = async (id) => {
  try {
    const result = await pool.query(
      "DELETE FROM reservations WHERE id = ? RETURNING *",
      [id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error deleting reservation: ${error.message}`);
  }
};
exports.createReservation = async (userId, checkIn, checkOut, type) => {
  try {
    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO reservations (id, user_id, check_in, check_out, type)
       VALUES (?, ?, ?, ?, ?) RETURNING *`,
      [id, userId, checkIn, checkOut, type]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error creating reservation: ${error.message}`);
  }
};

// Search reservations by various criteria
exports.searchReservations = async (query) => {
  try {
    const result = await pool.query(
      `SELECT r.*, u.first_name, u.last_name, u.email, u.phone FROM reservations r
       JOIN users u ON r.user_id = u.id
       WHERE u.phone LIKE ? OR u.email LIKE ? OR r.id = ?
       OR r.check_in = ? OR r.check_out = ?
       OR u.first_name LIKE ? OR u.last_name LIKE ?
       OR (u.first_name || ' ' || u.last_name) LIKE ?
       ORDER BY r.created_at DESC`,
      [
        `%${query}%`,
        `%${query}%`,
        query,
        query,
        query,
        `%${query}%`,
        `%${query}%`,
        `%${query}%`,
      ]
    );
    return result.rows;
  } catch (error) {
    throw new Error(`Error searching reservations: ${error.message}`);
  }
};

// Get reservation by ID
exports.getReservationById = async (id) => {
  try {
    const result = await pool.query(
      `SELECT r.*, u.first_name, u.last_name, u.email, u.phone FROM reservations r
       JOIN users u ON r.user_id = u.id
       WHERE r.id = ?`,
      [id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error getting reservation by ID: ${error.message}`);
  }
};

// Get all reservations for a user
exports.getReservationsByUserId = async (userId) => {
  try {
    const result = await pool.query(
      "SELECT * FROM reservations WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    return result.rows;
  } catch (error) {
    throw new Error(`Error getting reservations by user ID: ${error.message}`);
  }
};

// Get all reservations
exports.getAllReservations = async () => {
  try {
    const result = await pool.query(
      `SELECT r.*, u.first_name, u.last_name, u.email, u.phone FROM reservations r
       JOIN users u ON r.user_id = u.id
       ORDER BY r.created_at DESC`
    );
    return result.rows;
  } catch (error) {
    throw new Error(`Error getting all reservations: ${error.message}`);
  }
};

// Update reservation
exports.updateReservation = async (id, checkIn, checkOut, type) => {
  try {
    const result = await pool.query(
      `UPDATE reservations 
       SET check_in = ?, check_out = ?, type = ?
       WHERE id = ? RETURNING *`,
      [checkIn, checkOut, type, id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error updating reservation: ${error.message}`);
  }
};

// Delete reservation
exports.deleteReservation = async (id) => {
  try {
    const result = await pool.query(
      "DELETE FROM reservations WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error deleting reservation: ${error.message}`);
  }
};
