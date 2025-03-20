const express = require("express");
const router = express.Router();
const { getAllFlights, getFlightById } = require("../controllers/flight.controller");

router.get("/", getAllFlights);
router.get("/:id", getFlightById); // New route to fetch flight by ID

module.exports = router;
