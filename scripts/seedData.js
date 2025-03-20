const mongoose = require("mongoose");
require("dotenv").config();
const { sqlDB, connectSQL } = require("../config/sqlConfig");
const connectMongoDB = require("../config/mongo");
const fetchFlightData = require("../config/aviationstack");
const Flight = require("../models/flight.model");

// Function to Insert Airports into SQL
const insertAirports = async () => {
  console.log("🚀 Fetching German airports...");
  const airportData = await fetchFlightData("airports", { country: "Germany" });

  if (!airportData || !airportData.data) {
    console.error("❌ No airport data found!");
    return;
  }

  // Create table if not exists
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Airport (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      iata_code VARCHAR(10) UNIQUE,
      icao_code VARCHAR(10) UNIQUE,
      country VARCHAR(100),
      city VARCHAR(100),
      latitude FLOAT,
      longitude FLOAT
    );
  `;
  await sqlDB.query(createTableQuery);

  // Prepare airport data
  const airports = airportData.data.slice(0, 5).map((airport) => [
    airport.name,
    airport.iata_code,
    airport.icao_code,
    airport.country_name,
    airport.city,
    airport.latitude,
    airport.longitude,
  ]);

  // Insert Data
  const insertQuery =
    "INSERT INTO Airport (name, iata_code, icao_code, country, city, latitude, longitude) VALUES ?";
  await sqlDB.query(insertQuery, [airports]);
  console.log("✅ 5 German airports inserted into SQL database.");
};

// Function to Insert Flights into MongoDB
const insertFlights = async () => {
  console.log("🚀 Fetching sample flight data...");
  const flightData = await fetchFlightData("flights", { limit: 10 });

  if (!flightData || !flightData.data) {
    console.error("❌ No flight data found!");
    return;
  }

  const mapStatus = (apiStatus) => {
    switch (apiStatus) {
      case "scheduled":
      case "active":
        return "On Time";
      case "delayed":
        return "Delayed";
      case "cancelled":
        return "Cancelled";
      default:
        return "On Time"; // Default to "On Time" if no valid status is found
    }
  };

  const flights = flightData.data.slice(0, 10).map((flight) => ({
    flight_number: flight.flight?.number || "Unknown",
    airline: flight.airline?.name || "Unknown Airline",
    departure_airport: flight.departure?.airport || "Unknown Airport",
    arrival_airport: flight.arrival?.airport || "Unknown Airport",
    scheduled_departure: flight.departure?.scheduled ? new Date(flight.departure.scheduled) : null,
    actual_departure: flight.departure?.estimated ? new Date(flight.departure.estimated) : null,
    scheduled_arrival: flight.arrival?.scheduled ? new Date(flight.arrival.scheduled) : null,
    actual_arrival: flight.arrival?.estimated ? new Date(flight.arrival.estimated) : null,
    status: mapStatus(flight.flight_status),
    delay_duration: flight.departure?.delay || 0, // Default to 0 if no delay is found
  }));

  // Remove flights with missing required fields
  const validFlights = flights.filter(flight => flight.scheduled_departure && flight.scheduled_arrival);

  if (validFlights.length === 0) {
    console.error("❌ No valid flight data found!");
    return;
  }

  await Flight.insertMany(validFlights);
  console.log(`✅ ${validFlights.length} Sample flights inserted into MongoDB.`);
};

// Run the script
const run = async () => {
  try {
    await connectMongoDB();
    await connectSQL();
    await insertAirports();
    await insertFlights();
    console.log("🎉 Database seeding completed!");
  } catch (error) {
    console.error("❌ Error during seeding:", error.message);
  } finally {
    process.exit();
  }
};

run();
