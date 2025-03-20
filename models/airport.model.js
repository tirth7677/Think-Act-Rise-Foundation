const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/sqlConfig"); // Make sure sequelize is initialized correctly

const Airport = sequelize.define(
  "Airport",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    iata_code: {
      type: DataTypes.STRING(3),
      allowNull: false,
      unique: true,
    },
    icao_code: {
      type: DataTypes.STRING(4),
      allowNull: false,
      unique: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.FLOAT,
    },
    longitude: {
      type: DataTypes.FLOAT,
    },
  },
  {
    timestamps: false,
    tableName: "Airport",
  }
);

module.exports = Airport;
