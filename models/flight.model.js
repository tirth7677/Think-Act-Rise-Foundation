// models/flight.model.js
const mongoose = require('mongoose');

const FlightSchema = new mongoose.Schema({
  flight_number: {
    type: String,
    required: true,
    unique: true
  },
  airline: {
    type: String,
    required: true
  },
  departure_airport: {
    type: String,
    required: true
  },
  arrival_airport: {
    type: String,
    required: true
  },
  scheduled_departure: {
    type: Date,
    required: true
  },
  actual_departure: {
    type: Date
  },
  scheduled_arrival: {
    type: Date,
    required: true
  },
  actual_arrival: {
    type: Date
  },
  status: {
    type: String,
    enum: ['On Time', 'Delayed', 'Cancelled'],
    required: true
  },
  delay_duration: {
    type: Number, // Store delay in minutes
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Flight', FlightSchema);
