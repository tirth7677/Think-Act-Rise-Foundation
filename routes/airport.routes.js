const express = require("express");
const router = express.Router();
const { getAllAirports, getAirportById } = require("../controllers/airport.controller");

router.get("/", getAllAirports);
router.get("/:id", getAirportById); // New route to fetch airport by ID

module.exports = router;