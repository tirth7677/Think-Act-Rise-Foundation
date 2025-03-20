const mongoose = require('mongoose');

const DelayedFlightSchema = new mongoose.Schema({
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
  delay_duration: {
    type: Number, // Delay in minutes
    required: true
  },
  status: {
    type: String,
    default: 'Delayed'
  }
}, { timestamps: true });

module.exports = mongoose.model('DelayedFlight', DelayedFlightSchema);
