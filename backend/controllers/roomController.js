const Room = require("../models/Room");
const Hotel = require("../models/Hotel");

// Create a new room
exports.createRoom = async (req, res) => {
  try {
    const { hotel_id, room_number, room_type, price_per_night, capacity, amenities, description } = req.body;

    // Validation
    if (!hotel_id || !room_number || !room_type || !price_per_night || !capacity) {
      return res.status(400).json({
        error: "Hotel ID, room number, room type, price per night, and capacity are required"
      });
    }

    // Check if hotel exists
    const hotel = await Hotel.getHotelById(hotel_id);
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    // Validate price and capacity
    if (price_per_night <= 0) {
      return res.status(400).json({ error: "Price per night must be greater than 0" });
    }

    if (capacity <= 0) {
      return res.status(400).json({ error: "Capacity must be greater than 0" });
    }

    const room = await Room.createRoom(
      hotel_id, room_number, room_type, price_per_night, capacity, 
      amenities || "", description || ""
    );

    res.status(201).json({
      message: "Room created successfully",
      room
    });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all rooms
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.getAllRooms();
    res.json({ rooms });
  } catch (error) {
    console.error("Error getting rooms:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get rooms by hotel ID
exports.getRoomsByHotelId = async (req, res) => {
  try {
    const { hotel_id } = req.params;
    const rooms = await Room.getRoomsByHotelId(hotel_id);
    res.json({ rooms });
  } catch (error) {
    console.error("Error getting rooms:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get room by ID
exports.getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.getRoomById(id);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.json({ room });
  } catch (error) {
    console.error("Error getting room:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update room
exports.updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { room_number, room_type, price_per_night, capacity, amenities, description, is_available } = req.body;

    // Check if room exists
    const existingRoom = await Room.getRoomById(id);
    if (!existingRoom) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Validation
    if (!room_number || !room_type || !price_per_night || !capacity) {
      return res.status(400).json({
        error: "Room number, room type, price per night, and capacity are required"
      });
    }

    if (price_per_night <= 0) {
      return res.status(400).json({ error: "Price per night must be greater than 0" });
    }

    if (capacity <= 0) {
      return res.status(400).json({ error: "Capacity must be greater than 0" });
    }

    const room = await Room.updateRoom(
      id, room_number, room_type, price_per_night, capacity, 
      amenities, description, is_available !== undefined ? is_available : true
    );

    res.json({
      message: "Room updated successfully",
      room
    });
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete room
exports.deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if room exists
    const existingRoom = await Room.getRoomById(id);
    if (!existingRoom) {
      return res.status(404).json({ error: "Room not found" });
    }

    await Room.deleteRoom(id);

    res.json({
      message: "Room deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ error: error.message });
  }
};

// Search available rooms
exports.searchAvailableRooms = async (req, res) => {
  try {
    const { check_in, check_out, capacity, city } = req.query;

    if (!check_in || !check_out) {
      return res.status(400).json({ error: "Check-in and check-out dates are required" });
    }

    // Validate dates
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      return res.status(400).json({ error: "Check-in date cannot be in the past" });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ error: "Check-out date must be after check-in date" });
    }

    const rooms = await Room.searchAvailableRooms(check_in, check_out, capacity, city);

    res.json({
      message: `Found ${rooms.length} available room(s)`,
      rooms,
      search_criteria: {
        check_in,
        check_out,
        capacity: capacity || 1,
        city: city || "Any city"
      }
    });
  } catch (error) {
    console.error("Error searching rooms:", error);
    res.status(500).json({ error: error.message });
  }
};
