const mongoose = require('mongoose');

const mealItemSchema = new mongoose.Schema({
  name: String,
  quantity: String,
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
}, { _id: false });

const mealPlanSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  breakfast: [mealItemSchema],
  lunch: [mealItemSchema],
  dinner: [mealItemSchema],
  snacks: [mealItemSchema],
  totalCalories: {
    type: Number,
    required: true,
  },
  totalProtein: {
    type: Number,
    required: true,
  },
  totalCarbs: {
    type: Number,
    required: true,
  },
  totalFat: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  notes: {
    type: String,
    maxlength: 1000,
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
mealPlanSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('MealPlan', mealPlanSchema);
