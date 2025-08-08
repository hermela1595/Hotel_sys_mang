const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");

// Room routes
router.post("/", roomController.createRoom);
router.get("/", roomController.getAllRooms);
router.get("/search", roomController.searchAvailableRooms);
router.get("/hotel/:hotel_id", roomController.getRoomsByHotelId);
router.get("/:id", roomController.getRoomById);
router.put("/:id", roomController.updateRoom);
router.delete("/:id", roomController.deleteRoom);

module.exports = router;
