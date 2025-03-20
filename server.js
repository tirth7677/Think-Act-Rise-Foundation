const express = require("express");
require("dotenv").config();
const { connectSQL } = require("./config/sqlConfig");
const connectMongoDB = require("./config/mongo");
const { moveDelayedFlights } = require("./controllers/delayedFlight.controller");

// Import Routes
const flightRoutes = require("./routes/flight.routes");
const airportRoutes = require("./routes/airport.routes");
const delayedFlightRoutes = require("./routes/delayedFlight.routes");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// API Routes
app.use("/api/v1/flights", flightRoutes);
app.use("/api/v1/airports", airportRoutes);
app.use("/api/v1/delayed-flights", delayedFlightRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.send("✅ Flight Monitoring API is running!");
});

// Connect Databases & Start Server
const startServer = async () => {
  try {
    await connectSQL(); // Connect to MySQL
    await connectMongoDB(); // Connect to MongoDB
    console.log("✅ Databases connected successfully.");

    // Start Express Server
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

    // Start Delayed Flight Checker (Runs Every 1 Minute)
    setInterval(async () => {
      console.log("🔄 Checking for delayed flights...");
      await moveDelayedFlights();
    }, 60000); // 60000ms = 1 minute

  } catch (error) {
    console.error("❌ Error starting server:", error.message);
    process.exit(1); // Exit process if database connection fails
  }
};

// Start the Server
startServer();
