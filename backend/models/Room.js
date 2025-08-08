const pool = require("../db");

// Create a new room
exports.createRoom = async (hotel_id, room_number, room_type, price_per_night, capacity, amenities, description) => {
  try {
    const result = await pool.query(
      `INSERT INTO rooms (hotel_id, room_number, room_type, price_per_night, capacity, amenities, description) 
       VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *`,
      [hotel_id, room_number, room_type, price_per_night, capacity, amenities, description]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error creating room: ${error.message}`);
  }
};

// Get all rooms
exports.getAllRooms = async () => {
  try {
    const result = await pool.query(
      `SELECT r.*, h.name as hotel_name, h.city, h.country 
       FROM rooms r 
       JOIN hotels h ON r.hotel_id = h.id 
       ORDER BY h.name, r.room_number`
    );
    return result.rows;
  } catch (error) {
    throw new Error(`Error getting rooms: ${error.message}`);
  }
};

// Get rooms by hotel ID
exports.getRoomsByHotelId = async (hotel_id) => {
  try {
    const result = await pool.query(
      `SELECT r.*, h.name as hotel_name 
       FROM rooms r 
       JOIN hotels h ON r.hotel_id = h.id 
       WHERE r.hotel_id = ? 
       ORDER BY r.room_number`,
      [hotel_id]
    );
    return result.rows;
  } catch (error) {
    throw new Error(`Error getting rooms for hotel: ${error.message}`);
  }
};

// Get room by ID
exports.getRoomById = async (id) => {
  try {
    const result = await pool.query(
      `SELECT r.*, h.name as hotel_name, h.city, h.country 
       FROM rooms r 
       JOIN hotels h ON r.hotel_id = h.id 
       WHERE r.id = ?`,
      [id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error getting room: ${error.message}`);
  }
};

// Update room
exports.updateRoom = async (id, room_number, room_type, price_per_night, capacity, amenities, description, is_available) => {
  try {
    const result = await pool.query(
      `UPDATE rooms 
       SET room_number = ?, room_type = ?, price_per_night = ?, capacity = ?, amenities = ?, description = ?, is_available = ?
       WHERE id = ? RETURNING *`,
      [room_number, room_type, price_per_night, capacity, amenities, description, is_available, id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error updating room: ${error.message}`);
  }
};

// Delete room
exports.deleteRoom = async (id) => {
  try {
    const result = await pool.query(
      'DELETE FROM rooms WHERE id = ? RETURNING *',
      [id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error deleting room: ${error.message}`);
  }
};

// Search available rooms
exports.searchAvailableRooms = async (check_in, check_out, capacity, city) => {
  try {
    let query = `
      SELECT r.*, h.name as hotel_name, h.city, h.country, h.address, h.stars
      FROM rooms r 
      JOIN hotels h ON r.hotel_id = h.id 
      WHERE r.is_available = 1
      AND r.capacity >= ?
      AND r.id NOT IN (
        SELECT room_id FROM reservations 
        WHERE (check_in < ? AND check_out > ?)
        AND status != 'cancelled'
      )
    `;
    
    let params = [capacity || 1, check_out, check_in];
    
    if (city) {
      query += ` AND h.city LIKE ?`;
      params.push(`%${city}%`);
    }
    
    query += ` ORDER BY h.city, h.name, r.room_number`;
    
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    throw new Error(`Error searching available rooms: ${error.message}`);
  }
};
