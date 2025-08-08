const Hotel = require("../models/Hotel");

// Create a new hotel
exports.createHotel = async (req, res) => {
  try {
    const { name, address, city, country, phone, email, stars, description } =
      req.body;

    // Validation
    if (!name || !address || !city || !country || !phone || !email) {
      return res.status(400).json({
        error: "Name, address, city, country, phone, and email are required",
      });
    }

    if (stars && (stars < 1 || stars > 5)) {
      return res.status(400).json({
        error: "Stars rating must be between 1 and 5",
      });
    }

    const hotel = await Hotel.createHotel(
      name,
      address,
      city,
      country,
      phone,
      email,
      stars || 3,
      description || ""
    );

    res.status(201).json({
      message: "Hotel created successfully",
      hotel,
    });
  } catch (error) {
    console.error("Error creating hotel:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all hotels
exports.getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.getAllHotels();
    res.json({ hotels });
  } catch (error) {
    console.error("Error getting hotels:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get hotel by ID
exports.getHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.getHotelById(id);

    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    res.json({ hotel });
  } catch (error) {
    console.error("Error getting hotel:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update hotel
exports.updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, city, country, phone, email, stars, description } =
      req.body;

    // Check if hotel exists
    const existingHotel = await Hotel.getHotelById(id);
    if (!existingHotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    // Validation
    if (!name || !address || !city || !country || !phone || !email) {
      return res.status(400).json({
        error: "Name, address, city, country, phone, and email are required",
      });
    }

    if (stars && (stars < 1 || stars > 5)) {
      return res.status(400).json({
        error: "Stars rating must be between 1 and 5",
      });
    }

    const hotel = await Hotel.updateHotel(
      id,
      name,
      address,
      city,
      country,
      phone,
      email,
      stars,
      description
    );

    res.json({
      message: "Hotel updated successfully",
      hotel,
    });
  } catch (error) {
    console.error("Error updating hotel:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete hotel
exports.deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if hotel exists
    const existingHotel = await Hotel.getHotelById(id);
    if (!existingHotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    await Hotel.deleteHotel(id);

    res.json({
      message: "Hotel deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting hotel:", error);
    res.status(500).json({ error: error.message });
  }
};

// Search hotels
exports.searchHotels = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const hotels = await Hotel.searchHotels(query);

    res.json({
      message: `Found ${hotels.length} hotel(s)`,
      hotels,
    });
  } catch (error) {
    console.error("Error searching hotels:", error);
    res.status(500).json({ error: error.message });
  }
};
