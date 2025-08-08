const express = require("express");
const router = express.Router();
const hotelController = require("../controllers/hotelController");

// Hotel routes
router.post("/", hotelController.createHotel);
router.get("/", hotelController.getAllHotels);
router.get("/search", hotelController.searchHotels);
router.get("/:id", hotelController.getHotelById);
router.put("/:id", hotelController.updateHotel);
router.delete("/:id", hotelController.deleteHotel);

module.exports = router;
