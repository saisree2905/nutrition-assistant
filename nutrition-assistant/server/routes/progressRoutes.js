const express = require('express');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validation');
const {
  getProgress,
  getProgressById,
  createProgress,
  updateProgress,
  deleteProgress,
  getProgressStats,
} = require('../controllers/progressController');
const {
  createProgressValidators,
  idValidators,
  paginationValidators,
} = require('../validators/inputValidators');

const router = express.Router();

router.use(protect);

router.get('/', paginationValidators(), validate, getProgress);
router.get('/stats/summary', getProgressStats);
router.post('/', createProgressValidators(), validate, createProgress);
router.get('/:id', idValidators(), validate, getProgressById);
router.put('/:id', idValidators(), validate, updateProgress);
router.delete('/:id', idValidators(), validate, deleteProgress);

module.exports = router;
