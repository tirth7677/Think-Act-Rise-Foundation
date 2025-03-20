const mongoose = require("mongoose");
require("dotenv").config();
const { sequelize, connectSQL } = require("../config/sqlConfig"); // ✅ Use sequelize instead of sqlDB
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
      name VARCHAR(255) NOT NULL,
      iata_code VARCHAR(10) UNIQUE,
      icao_code VARCHAR(10) UNIQUE,
      country VARCHAR(100),
      city VARCHAR(100) NOT NULL,
      latitude FLOAT,
      longitude FLOAT
    );
  `;
  await sequelize.query(createTableQuery); // ✅ Use sequelize.query instead of sqlDB.query

  // Filter only valid airports
  const validAirports = airportData.data
    .filter((airport) => airport.airport_name && airport.city_iata_code)
    .slice(0, 5)
    .map((airport) => [
      airport.airport_name,
      airport.iata_code || null,
      airport.icao_code || null,
      airport.country_name,
      airport.city_iata_code,
      airport.latitude || null,
      airport.longitude || null,
    ]);

  if (validAirports.length === 0) {
    console.error("❌ No valid airports found!");
    return;
  }

  // Insert Data
  const insertQuery = `
    INSERT INTO Airport (name, iata_code, icao_code, country, city, latitude, longitude) 
    VALUES ?
  `;
  await sequelize.query(insertQuery, { replacements: [validAirports] }); // ✅ Fixed insert statement

  console.log(`✅ ${validAirports.length} German airports inserted into SQL database.`);
};

const insertFlights = async () => {
  console.log("🚀 Fetching sample flight data...");

  let validFlights = [];
  let offset = 0;
  const limit = 20;

  while (validFlights.length < 10) {
    const flightData = await fetchFlightData("flights", { limit, offset });

    if (!flightData || !flightData.data) {
      console.error("❌ No flight data found!");
      break;
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
          return "On Time";
      }
    };

    const flights = flightData.data
      .map((flight) => {
        if (
          !flight.flight?.number ||
          !flight.airline?.name ||
          !flight.departure?.airport ||
          !flight.arrival?.airport ||
          !flight.departure?.scheduled ||
          !flight.arrival?.scheduled
        ) {
          return null;
        }

        return {
          flight_number: flight.flight.number,
          airline: flight.airline.name,
          departure_airport: flight.departure.airport,
          arrival_airport: flight.arrival.airport,
          scheduled_departure: new Date(flight.departure.scheduled),
          actual_departure: flight.departure.estimated ? new Date(flight.departure.estimated) : null,
          scheduled_arrival: new Date(flight.arrival.scheduled),
          actual_arrival: flight.arrival.estimated ? new Date(flight.arrival.estimated) : null,
          status: mapStatus(flight.flight_status),
          delay_duration: flight.departure.delay || 0,
        };
      })
      .filter((flight) => flight !== null);

    validFlights = [...validFlights, ...flights];

    if (validFlights.length < 10) {
      console.log(`🔄 Fetching more flights... (Currently: ${validFlights.length}/10)`);
      offset += limit;
    }
  }

  validFlights = validFlights.slice(0, 10);

  if (validFlights.length === 0) {
    console.error("❌ No valid flights found!");
    return;
  }

  await Flight.insertMany(validFlights);
  console.log(`✅ Successfully inserted ${validFlights.length} flights into MongoDB.`);
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
