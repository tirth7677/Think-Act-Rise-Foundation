const express = require("express");
const router = express.Router();
const { getAllDelayedFlights, getDelayedFlightById } = require("../controllers/delayedFlight.controller");

// Route to get all delayed flights
router.get("/", getAllDelayedFlights);

// Route to get a specific delayed flight by flight number
router.get("/:flight_number", getDelayedFlightById);

module.exports = router;
