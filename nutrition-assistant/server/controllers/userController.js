const User = require('../models/User');
const Client = require('../models/Client');
const Progress = require('../models/Progress');
const { calculateBMI, getCalorieNeeds } = require('../utils/bmiCalculator');
const path = require('path');
const fs = require('fs');

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    const allowedUpdates = [
      'name',
      'phone',
      'gender',
      'age',
      'height',
      'weight',
      'allergies',
      'medicalConditions',
      'goals',
      'activityLevel',
    ];

    Object.keys(updates).forEach(key => {
      if (!allowedUpdates.includes(key)) {
        delete updates[key];
      }
    });

    // Calculate BMI if height or weight is updated
    if (updates.height || updates.weight) {
      const height = updates.height || req.user.height;
      const weight = updates.weight || req.user.weight;
      updates.BMI = calculateBMI(weight, height);
    }

    updates.updatedAt = Date.now();

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image provided',
      });
    }

    // Delete old image if exists
    const user = await User.findById(req.user._id);
    if (user.profileImage) {
      const oldImagePath = path.join(__dirname, '../uploads', user.profileImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const filename = `profile-${req.user._id}-${Date.now()}${path.extname(req.file.originalname)}`;
    const filepath = path.join(__dirname, '../uploads', filename);

    fs.renameSync(req.file.path, filepath);

    user.profileImage = `/uploads/${filename}`;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile image uploaded successfully',
      data: {
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.role === 'user') {
      const client = await Client.findOne({ userId: req.user._id });

      if (!client) {
        return res.status(404).json({
          success: false,
          message: 'Client profile not found',
        });
      }

      const progressRecords = await Progress.find({ clientId: client._id })
        .sort({ date: -1 })
        .limit(7);

      const todayProgress = await Progress.findOne({
        clientId: client._id,
        date: {
          $gte: new Date().setHours(0, 0, 0, 0),
          $lte: new Date().setHours(23, 59, 59, 999),
        },
      });

      const calorieNeeds = getCalorieNeeds(
        user.weight,
        user.height,
        user.age,
        user.gender,
        user.activityLevel
      );

      res.status(200).json({
        success: true,
        data: {
          user: user.toJSON(),
          client,
          todayProgress: todayProgress || null,
          recentProgress: progressRecords,
          targets: {
            calories: client.targetCalories,
            protein: client.targetProtein,
            carbs: client.targetCarbs,
            fat: client.targetFat,
          },
          recommendations: calorieNeeds,
        },
      });
    } else if (user.role === 'dietitian') {
      const clientCount = await Client.countDocuments({ assignedDietitian: req.user._id });

      res.status(200).json({
        success: true,
        data: {
          user: user.toJSON(),
          clientCount,
        },
      });
    } else {
      res.status(200).json({
        success: true,
        data: {
          user: user.toJSON(),
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    const isPasswordCorrect = await user.matchPassword(currentPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfileImage,
  getUserStats,
  changePassword,
};
