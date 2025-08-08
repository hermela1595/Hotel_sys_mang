const pool = require("../db");

// Create a new hotel
exports.createHotel = async (name, address, city, country, phone, email, stars, description) => {
  try {
    const result = await pool.query(
      `INSERT INTO hotels (name, address, city, country, phone, email, stars, description) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
      [name, address, city, country, phone, email, stars, description]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error creating hotel: ${error.message}`);
  }
};

// Get all hotels
exports.getAllHotels = async () => {
  try {
    const result = await pool.query(
      "SELECT * FROM hotels ORDER BY created_at DESC"
    );
    return result.rows;
  } catch (error) {
    throw new Error(`Error getting hotels: ${error.message}`);
  }
};

// Get hotel by ID
exports.getHotelById = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM hotels WHERE id = ?", [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error getting hotel: ${error.message}`);
  }
};

// Update hotel
exports.updateHotel = async (id, name, address, city, country, phone, email, stars, description) => {
  try {
    const result = await pool.query(
      `UPDATE hotels 
       SET name = ?, address = ?, city = ?, country = ?, phone = ?, email = ?, stars = ?, description = ?
       WHERE id = ? RETURNING *`,
      [name, address, city, country, phone, email, stars, description, id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error updating hotel: ${error.message}`);
  }
};

// Delete hotel
exports.deleteHotel = async (id) => {
  try {
    const result = await pool.query(
      'DELETE FROM hotels WHERE id = ? RETURNING *',
      [id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error deleting hotel: ${error.message}`);
  }
};

// Search hotels
exports.searchHotels = async (query) => {
  try {
    const searchQuery = `%${query}%`;
    const result = await pool.query(
      `SELECT * FROM hotels 
       WHERE name LIKE ? OR city LIKE ? OR country LIKE ? OR address LIKE ?
       ORDER BY name`,
      [searchQuery, searchQuery, searchQuery, searchQuery]
    );
    return result.rows;
  } catch (error) {
    throw new Error(`Error searching hotels: ${error.message}`);
  }
};
