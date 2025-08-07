const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");

// Create a new reservation
router.post("/", reservationController.createReservation);

// Search reservations
router.get("/search", reservationController.searchReservations);

// Get all reservations
router.get("/", reservationController.getAllReservations);

// Get reservation by ID
router.get("/:id", reservationController.getReservationById);

// Update reservation
router.put("/:id", reservationController.updateReservation);

// Delete reservation
router.delete("/:id", reservationController.deleteReservation);

module.exports = router;
