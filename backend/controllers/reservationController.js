const Reservation = require("../models/Reservation");
const User = require("../models/User");

// Create a new reservation
exports.createReservation = async (req, res) => {
  try {
    const { email, phone, checkIn, checkOut, type } = req.body;

    // Validation
    if (!email || !phone || !checkIn || !checkOut || !type) {
      return res.status(400).json({
        error:
          "Email, phone, check-in date, check-out date, and type are required",
      });
    }

    // Validate reservation type
    const validTypes = ["daily", "weekly", "monthly"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: "Type must be one of: daily, weekly, monthly",
      });
    }

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      return res
        .status(400)
        .json({ error: "Check-in date cannot be in the past" });
    }

    if (checkOutDate <= checkInDate) {
      return res
        .status(400)
        .json({ error: "Check-out date must be after check-in date" });
    }

    // Find or create user
    let user = await User.findUserByEmail(email);
    if (!user) {
      // Check if phone exists with different email
      const existingUserByPhone = await User.findUserByPhone(phone);
      if (existingUserByPhone) {
        return res.status(409).json({
          error:
            "Phone number is already associated with a different email address",
        });
      }
      user = await User.createUser(email, phone);
    } else {
      // Verify phone matches
      if (user.phone !== phone) {
        return res.status(409).json({
          error: "Phone number does not match the email address on file",
        });
      }
    }

    const reservation = await Reservation.createReservation(
      user.id,
      checkIn,
      checkOut,
      type
    );

    res.status(201).json({
      message: "Reservation created successfully",
      reservation: {
        id: reservation.id,
        user: {
          email: user.email,
          phone: user.phone,
        },
        check_in: reservation.check_in,
        check_out: reservation.check_out,
        type: reservation.type,
        created_at: reservation.created_at,
      },
    });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Search reservations
exports.searchReservations = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const reservations = await Reservation.searchReservations(query);

    res.json({
      query,
      results: reservations.length,
      reservations: reservations.map((reservation) => ({
        id: reservation.id,
        user: {
          email: reservation.email,
          phone: reservation.phone,
        },
        check_in: reservation.check_in,
        check_out: reservation.check_out,
        type: reservation.type,
        created_at: reservation.created_at,
      })),
    });
  } catch (error) {
    console.error("Error searching reservations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get reservation by ID
exports.getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.getReservationById(id);

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.json({
      id: reservation.id,
      user: {
        email: reservation.email,
        phone: reservation.phone,
      },
      check_in: reservation.check_in,
      check_out: reservation.check_out,
      type: reservation.type,
      created_at: reservation.created_at,
    });
  } catch (error) {
    console.error("Error getting reservation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all reservations
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.getAllReservations();

    res.json({
      total: reservations.length,
      reservations: reservations.map((reservation) => ({
        id: reservation.id,
        user: {
          email: reservation.email,
          phone: reservation.phone,
        },
        check_in: reservation.check_in,
        check_out: reservation.check_out,
        type: reservation.type,
        created_at: reservation.created_at,
      })),
    });
  } catch (error) {
    console.error("Error getting all reservations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update reservation
exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { checkIn, checkOut, type } = req.body;

    // Validation
    if (!checkIn || !checkOut || !type) {
      return res.status(400).json({
        error: "Check-in date, check-out date, and type are required",
      });
    }

    // Validate reservation type
    const validTypes = ["daily", "weekly", "monthly"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: "Type must be one of: daily, weekly, monthly",
      });
    }

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      return res
        .status(400)
        .json({ error: "Check-out date must be after check-in date" });
    }

    const updatedReservation = await Reservation.updateReservation(
      id,
      checkIn,
      checkOut,
      type
    );

    if (!updatedReservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.json({
      message: "Reservation updated successfully",
      reservation: updatedReservation,
    });
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete reservation
exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReservation = await Reservation.deleteReservation(id);

    if (!deletedReservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.json({
      message: "Reservation deleted successfully",
      reservation: deletedReservation,
    });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
