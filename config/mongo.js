const mongoose = require("mongoose");
require("dotenv").config();

const connectMongoDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("Missing MongoDB connection string (MONGO_URI)");
    }

    await mongoose.connect(process.env.MONGO_URI); // Removed deprecated options
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectMongoDB;
