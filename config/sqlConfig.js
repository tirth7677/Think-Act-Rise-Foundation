const mysql = require("mysql2/promise");
require("dotenv").config();

const sqlDB = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

const connectSQL = async () => {
  try {
    await sqlDB.getConnection(); // Test Connection
    console.log("✅ MySQL Connected Successfully!");
  } catch (error) {
    console.error("❌ MySQL Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = { sqlDB, connectSQL };
