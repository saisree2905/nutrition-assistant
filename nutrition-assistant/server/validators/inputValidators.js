const { body, param, query } = require('express-validator');

// Auth validators
const registerValidators = () => [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email')
    .trim()
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/[a-zA-Z]/).withMessage('Password must contain letters')
    .matches(/[0-9]/).withMessage('Password must contain numbers'),
  body('role')
    .optional()
    .isIn(['user', 'dietitian']).withMessage('Invalid role'),
];

const loginValidators = () => [
  body('email')
    .trim()
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

const forgotPasswordValidators = () => [
  body('email')
    .trim()
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
];

const resetPasswordValidators = () => [
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/[a-zA-Z]/).withMessage('Password must contain letters')
    .matches(/[0-9]/).withMessage('Password must contain numbers'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

// User validators
const updateProfileValidators = () => [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Invalid phone number'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
  body('age')
    .optional()
    .isInt({ min: 1, max: 120 }).withMessage('Age must be between 1 and 120'),
  body('height')
    .optional()
    .isInt({ min: 50, max: 300 }).withMessage('Height must be between 50 and 300 cm'),
  body('weight')
    .optional()
    .isFloat({ min: 20, max: 500 }).withMessage('Weight must be between 20 and 500 kg'),
  body('activityLevel')
    .optional()
    .isIn(['sedentary', 'light', 'moderate', 'active', 'veryActive'])
    .withMessage('Invalid activity level'),
];

// Client validators
const createClientValidators = () => [
  body('userId')
    .notEmpty().withMessage('User ID is required')
    .isMongoId().withMessage('Invalid user ID'),
  body('targetCalories')
    .notEmpty().withMessage('Target calories is required')
    .isInt({ min: 500, max: 5000 }).withMessage('Calories must be between 500 and 5000'),
  body('targetProtein')
    .notEmpty().withMessage('Target protein is required')
    .isFloat({ min: 0, max: 500 }).withMessage('Protein must be between 0 and 500'),
  body('targetCarbs')
    .notEmpty().withMessage('Target carbs is required')
    .isFloat({ min: 0, max: 1000 }).withMessage('Carbs must be between 0 and 1000'),
  body('targetFat')
    .notEmpty().withMessage('Target fat is required')
    .isFloat({ min: 0, max: 500 }).withMessage('Fat must be between 0 and 500'),
];

const updateClientValidators = () => [
  body('targetCalories')
    .optional()
    .isInt({ min: 500, max: 5000 }).withMessage('Calories must be between 500 and 5000'),
  body('targetProtein')
    .optional()
    .isFloat({ min: 0, max: 500 }).withMessage('Protein must be between 0 and 500'),
  body('targetCarbs')
    .optional()
    .isFloat({ min: 0, max: 1000 }).withMessage('Carbs must be between 0 and 1000'),
  body('targetFat')
    .optional()
    .isFloat({ min: 0, max: 500 }).withMessage('Fat must be between 0 and 500'),
];

// Meal Plan validators
const createMealPlanValidators = () => [
  body('clientId')
    .notEmpty().withMessage('Client ID is required')
    .isMongoId().withMessage('Invalid client ID'),
  body('totalCalories')
    .notEmpty().withMessage('Total calories is required')
    .isInt({ min: 500, max: 5000 }).withMessage('Calories must be between 500 and 5000'),
  body('totalProtein')
    .notEmpty().withMessage('Total protein is required')
    .isFloat({ min: 0, max: 500 }).withMessage('Protein must be between 0 and 500'),
  body('totalCarbs')
    .notEmpty().withMessage('Total carbs is required')
    .isFloat({ min: 0, max: 1000 }).withMessage('Carbs must be between 0 and 1000'),
  body('totalFat')
    .notEmpty().withMessage('Total fat is required')
    .isFloat({ min: 0, max: 500 }).withMessage('Fat must be between 0 and 500'),
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Valid date is required'),
];

// Progress validators
const createProgressValidators = () => [
  body('clientId')
    .notEmpty().withMessage('Client ID is required')
    .isMongoId().withMessage('Invalid client ID'),
  body('weight')
    .notEmpty().withMessage('Weight is required')
    .isFloat({ min: 20, max: 500 }).withMessage('Weight must be between 20 and 500 kg'),
  body('caloriesConsumed')
    .notEmpty().withMessage('Calories consumed is required')
    .isInt({ min: 0, max: 10000 }).withMessage('Calories must be between 0 and 10000'),
  body('waterIntake')
    .optional()
    .isInt({ min: 0, max: 50 }).withMessage('Water intake must be between 0 and 50 liters'),
  body('exerciseMinutes')
    .optional()
    .isInt({ min: 0, max: 1440 }).withMessage('Exercise minutes must be between 0 and 1440'),
];

// ID validators
const idValidators = () => [
  param('id')
    .isMongoId().withMessage('Invalid ID format'),
];

// Query validators
const paginationValidators = () => [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be at least 1'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

module.exports = {
  registerValidators,
  loginValidators,
  forgotPasswordValidators,
  resetPasswordValidators,
  updateProfileValidators,
  createClientValidators,
  updateClientValidators,
  createMealPlanValidators,
  createProgressValidators,
  idValidators,
  paginationValidators,
};
