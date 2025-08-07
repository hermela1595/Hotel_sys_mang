const User = require("../models/User");

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { email, phone } = req.body;

    // Validation
    if (!email || !phone) {
      return res.status(400).json({ error: "Email and phone are required" });
    }

    // Check if user already exists
    const existingUserByEmail = await User.findUserByEmail(email);
    if (existingUserByEmail) {
      return res
        .status(409)
        .json({ error: "User with this email already exists" });
    }

    const existingUserByPhone = await User.findUserByPhone(phone);
    if (existingUserByPhone) {
      return res
        .status(409)
        .json({ error: "User with this phone number already exists" });
    }

    const user = await User.createUser(email, phone);
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findUserById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user.id,
      email: user.email,
      phone: user.phone,
      created_at: user.created_at,
    });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user by email
exports.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user.id,
      email: user.email,
      phone: user.phone,
      created_at: user.created_at,
    });
  } catch (error) {
    console.error("Error getting user by email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user by phone
exports.getUserByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    const user = await User.findUserByPhone(phone);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user.id,
      email: user.email,
      phone: user.phone,
      created_at: user.created_at,
    });
  } catch (error) {
    console.error("Error getting user by phone:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(
      users.map((user) => ({
        id: user.id,
        email: user.email,
        phone: user.phone,
        created_at: user.created_at,
      }))
    );
  } catch (error) {
    console.error("Error getting all users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
