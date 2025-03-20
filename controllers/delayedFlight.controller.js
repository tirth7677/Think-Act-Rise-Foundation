const Flight = require("../models/flight.model");
const DelayedFlight = require("../models/delayedFlight.model");
const response = require("../utils/response");
const errorResponse = require("../utils/error");

/**
 * Moves delayed flights (delay > 120 mins) to the DelayedFlight collection.
 * Runs automatically in `server.js` every 1 minute.
 */
exports.moveDelayedFlights = async () => {
  try {
    // Find flights that are delayed more than 120 minutes
    const delayedFlights = await Flight.find({ status: "delayed", delay_duration: { $gt: 120 } });

    if (!delayedFlights.length) {
      console.log("✅ No new delayed flights found.");
      return;
    }

    for (const flight of delayedFlights) {
      // Check if the flight already exists in the DelayedFlight collection
      const existingDelayedFlight = await DelayedFlight.findOne({ flight_number: flight.flight_number });

      if (!existingDelayedFlight) {
        // Create a new delayed flight entry
        await DelayedFlight.create({
          flight_number: flight.flight_number,
          airline: flight.airline,
          departure_airport: flight.departure_airport,
          arrival_airport: flight.arrival_airport,
          scheduled_departure: flight.scheduled_departure,
          actual_departure: flight.actual_departure || null,
          delay_duration: flight.delay_duration,
          status: "Delayed"
        });

        console.log(`🚨 Flight ${flight.flight_number} moved to DelayedFlight collection.`);
      }
    }
  } catch (error) {
    console.error("❌ Error moving delayed flights:", error.message);
  }
};

/**
 * Fetch all delayed flights from the DelayedFlight collection.
 */
exports.getAllDelayedFlights = async (req, res) => {
  try {
    const delayedFlights = await DelayedFlight.find();

    if (!delayedFlights.length) {
      return res.status(404).json(errorResponse("No delayed flights found", 404));
    }

    res.status(200).json(response("Delayed flights retrieved successfully", 200, delayedFlights));
  } catch (error) {
    console.error("❌ Error fetching delayed flights:", error);
    res.status(500).json(errorResponse("Internal Server Error", 500));
  }
};

/**
 * Fetch a single delayed flight by flight number.
 */
exports.getDelayedFlightById = async (req, res) => {
  try {
    const { flight_number } = req.params;

    const delayedFlight = await DelayedFlight.findOne({ flight_number });

    if (!delayedFlight) {
      return res.status(404).json(errorResponse("Delayed flight not found", 404));
    }

    res.status(200).json(response("Delayed flight retrieved successfully", 200, delayedFlight));
  } catch (error) {
    console.error("❌ Error fetching delayed flight:", error);
    res.status(500).json(errorResponse("Internal Server Error", 500));
  }
};
