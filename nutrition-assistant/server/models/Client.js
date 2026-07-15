const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedDietitian: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  targetCalories: {
    type: Number,
    required: true,
    min: 500,
    max: 5000,
  },
  targetProtein: {
    type: Number,
    required: true,
    min: 0,
    max: 500,
  },
  targetCarbs: {
    type: Number,
    required: true,
    min: 0,
    max: 1000,
  },
  targetFat: {
    type: Number,
    required: true,
    min: 0,
    max: 500,
  },
  notes: {
    type: String,
    maxlength: 1000,
  },
  isActive: {
    type: Boolean,
    default: true,
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
clientSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Client', clientSchema);
