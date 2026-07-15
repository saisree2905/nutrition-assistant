const express = require('express');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validation');
const {
  getMealPlans,
  getMealPlanById,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
} = require('../controllers/mealPlanController');
const {
  createMealPlanValidators,
  idValidators,
  paginationValidators,
} = require('../validators/inputValidators');

const router = express.Router();

router.use(protect);

router.get('/', paginationValidators(), validate, getMealPlans);
router.post('/', createMealPlanValidators(), validate, createMealPlan);
router.get('/:id', idValidators(), validate, getMealPlanById);
router.put('/:id', idValidators(), validate, updateMealPlan);
router.delete('/:id', idValidators(), validate, deleteMealPlan);

module.exports = router;
