const express = require("express");
require("dotenv").config();
const { connectSQL } = require("./config/sqlConfig");
const connectMongoDB = require("./config/mongo");
const airportRoutes = require("./routes/airport.routes");
const flightRoutes = require("./routes/flight.routes");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/airports", airportRoutes);
app.use("/api/v1/flights", flightRoutes);

// Connect Databases
const startServer = async () => {
  try {
    await connectSQL(); // Connect to SQL
    await connectMongoDB(); // Connect to MongoDB
    console.log("✅ Databases connected successfully.");

    // Start Express Server
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Error starting server:", error.message);
    process.exit(1); // Exit process if database connection fails
  }
};

// Health Check Route
app.get("/", (req, res) => {
  res.send("✅ Flight Monitoring API is running!");
});

// Start the Server
startServer();
