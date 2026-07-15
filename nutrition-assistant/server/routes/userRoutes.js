const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validation');
const {
  getProfile,
  updateProfile,
  uploadProfileImage,
  getUserStats,
  changePassword,
} = require('../controllers/userController');
const {
  updateProfileValidators,
  resetPasswordValidators,
} = require('../validators/inputValidators');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `profile-${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfileValidators(), validate, updateProfile);
router.post('/upload-image', upload.single('image'), uploadProfileImage);
router.get('/stats', getUserStats);
router.put('/change-password', resetPasswordValidators(), validate, changePassword);

module.exports = router;
