const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
    logging: false, // Set to true if you want SQL queries to be logged
  }
);

const connectSQL = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL Connected Successfully!");
  } catch (error) {
    console.error("❌ MySQL Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectSQL };
