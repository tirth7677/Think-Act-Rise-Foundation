// models/claim.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sqlConfig');

const Claim = sequelize.define('Claim', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  flight_number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  airline: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
    defaultValue: 'Pending'
  },
  compensation_amount: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
});

module.exports = Claim;
