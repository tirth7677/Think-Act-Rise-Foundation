const express = require("express");
require("dotenv").config();
const { connectSQL } = require("./config/database");
const connectMongoDB = require("./config/mongo");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Databases
connectSQL();
connectMongoDB();

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));