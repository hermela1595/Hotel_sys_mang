const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Create a new user
router.post("/", userController.createUser);

// Get user by ID
router.get("/:id", userController.getUserById);

// Get user by email
router.get("/email/:email", userController.getUserByEmail);

// Get user by phone
router.get("/phone/:phone", userController.getUserByPhone);

// Get all users
router.get("/", userController.getAllUsers);

module.exports = router;
