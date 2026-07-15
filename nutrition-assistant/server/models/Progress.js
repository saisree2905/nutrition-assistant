const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: () => new Date().setHours(0, 0, 0, 0),
  },
  weight: {
    type: Number,
    required: true,
    min: 20,
    max: 500,
  },
  caloriesConsumed: {
    type: Number,
    required: true,
    min: 0,
    max: 10000,
  },
  waterIntake: {
    type: Number,
    default: 0,
    min: 0,
    max: 50,
  },
  exerciseMinutes: {
    type: Number,
    default: 0,
    min: 0,
    max: 1440,
  },
  adherencePercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  notes: {
    type: String,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update updatedAt before saving
progressSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying
progressSchema.index({ clientId: 1, date: -1 });

module.exports = mongoose.model('Progress', progressSchema);
