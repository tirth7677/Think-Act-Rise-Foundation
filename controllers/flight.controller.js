const Flight = require("../models/flight.model");
const response = require("../utils/response");
const errorResponse = require("../utils/error");

exports.getAllFlights = async (req, res) => {
    try {
        const flights = await Flight.find();

        if (!flights.length) {
            return res.status(404).json(errorResponse("No flights found", 404));
        }

        res.status(200).json(response("Flights retrieved successfully", 200, flights));
    } catch (error) {
        console.error("Error fetching flights:", error);
        res.status(500).json(errorResponse("Internal Server Error", 500));
    }
};

exports.getFlightById = async (req, res) => {
    try {
        const { id } = req.params;
        const flight = await Flight.findById(id);

        if (!flight) {
            return res.status(404).json(errorResponse("Flight not found", 404));
        }

        res.status(200).json(response("Flight retrieved successfully", 200, flight));
    } catch (error) {
        console.error("Error fetching flight:", error);
        res.status(500).json(errorResponse("Internal Server Error", 500));
    }
};
