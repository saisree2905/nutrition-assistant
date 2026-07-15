const express = require('express');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validation');
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  refreshToken,
} = require('../controllers/authController');
const {
  registerValidators,
  loginValidators,
  forgotPasswordValidators,
  resetPasswordValidators,
} = require('../validators/inputValidators');

const router = express.Router();

router.post('/register', registerValidators(), validate, register);
router.post('/login', loginValidators(), validate, login);
router.post('/logout', protect, logout);
router.post('/forgot-password', forgotPasswordValidators(), validate, forgotPassword);
router.post('/reset-password/:resetToken', resetPasswordValidators(), validate, resetPassword);
router.post('/refresh-token', refreshToken);

module.exports = router;
