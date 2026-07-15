const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validation');
const {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} = require('../controllers/clientController');
const {
  createClientValidators,
  updateClientValidators,
  idValidators,
  paginationValidators,
} = require('../validators/inputValidators');

const router = express.Router();

router.use(protect);
router.use(authorize('dietitian', 'admin'));

router.get('/', paginationValidators(), validate, getAllClients);
router.post('/', createClientValidators(), validate, createClient);
router.get('/:id', idValidators(), validate, getClientById);
router.put('/:id', idValidators(), updateClientValidators(), validate, updateClient);
router.delete('/:id', idValidators(), validate, deleteClient);

module.exports = router;
