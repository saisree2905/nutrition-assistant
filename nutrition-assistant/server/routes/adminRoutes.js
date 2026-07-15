const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validation');
const {
  getDashboardStats,
  getAllUsers,
  getAllDietitians,
  approveDietitian,
  rejectDietitian,
  deleteUser,
  getPlatformAnalytics,
} = require('../controllers/adminController');
const {
  idValidators,
  paginationValidators,
} = require('../validators/inputValidators');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard/stats', getDashboardStats);
router.get('/users', paginationValidators(), validate, getAllUsers);
router.get('/dietitians', paginationValidators(), validate, getAllDietitians);
router.put('/approve-dietitian/:id', idValidators(), validate, approveDietitian);
router.delete('/reject-dietitian/:id', idValidators(), validate, rejectDietitian);
router.delete('/users/:id', idValidators(), validate, deleteUser);
router.get('/analytics/platform', getPlatformAnalytics);

module.exports = router;
