const Airport = require("../models/airport.model"); // Using Sequelize model
const response = require("../utils/response");
const errorResponse = require("../utils/error");

exports.getAllAirports = async (req, res) => {
  try {
    const airports = await Airport.findAll();
    
    if (!airports.length) {
      return res.status(404).json(errorResponse("No airports found", 404));
    }
    
    res.status(200).json(response("Airports retrieved successfully", 200, airports));
  } catch (error) {
    console.error("Error fetching airports:", error);
    res.status(500).json(errorResponse("Internal Server Error", 500));
  }
};

exports.getAirportById = async (req, res) => {
  try {
    const { id } = req.params;
    const airport = await Airport.findByPk(id);

    if (!airport) {
      return res.status(404).json(errorResponse("Airport not found", 404));
    }

    res.status(200).json(response("Airport retrieved successfully", 200, airport));
  } catch (error) {
    console.error("Error fetching airport:", error);
    res.status(500).json(errorResponse("Internal Server Error", 500));
  }
};
