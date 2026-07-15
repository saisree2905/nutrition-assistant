const User = require('../models/User');
const Client = require('../models/Client');
const MealPlan = require('../models/MealPlan');
const Progress = require('../models/Progress');
const { sendDietitianApprovalEmail } = require('../utils/emailService');

const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalDietitians = await User.countDocuments({ role: 'dietitian' });
    const approvedDietitians = await User.countDocuments({ role: 'dietitian', isApproved: true });
    const pendingDietitians = await User.countDocuments({ role: 'dietitian', isApproved: false });
    const totalClients = await Client.countDocuments();
    const totalMealPlans = await MealPlan.countDocuments();

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt');

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalDietitians,
        approvedDietitians,
        pendingDietitians,
        totalClients,
        totalMealPlans,
        recentUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;

    const query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const users = await User.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .select('-password -refreshTokens');

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAllDietitians = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, approved, search } = req.query;

    const query = { role: 'dietitian' };

    if (approved !== undefined) {
      query.isApproved = approved === 'true';
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const dietitians = await User.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .select('-password -refreshTokens');

    const total = await User.countDocuments(query);

    // Get client count for each dietitian
    const dietitiansWithClients = await Promise.all(
      dietitians.map(async (dietitian) => {
        const clientCount = await Client.countDocuments({ assignedDietitian: dietitian._id });
        return {
          ...dietitian.toObject(),
          clientCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: dietitiansWithClients,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const approveDietitian = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role !== 'dietitian') {
      return res.status(400).json({
        success: false,
        message: 'User is not a dietitian',
      });
    }

    user.isApproved = true;
    await user.save();

    try {
      await sendDietitianApprovalEmail(user.email, user.name);
    } catch (error) {
      console.error('Failed to send approval email:', error);
    }

    res.status(200).json({
      success: true,
      message: 'Dietitian approved successfully',
      data: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

const rejectDietitian = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role !== 'dietitian') {
      return res.status(400).json({
        success: false,
        message: 'User is not a dietitian',
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Dietitian registration rejected',
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // If user is a client, delete their data
    if (user.role === 'user') {
      const client = await Client.findOne({ userId: id });
      if (client) {
        await Progress.deleteMany({ clientId: client._id });
        await MealPlan.deleteMany({ clientId: client._id });
        await Client.findByIdAndDelete(client._id);
      }
    }

    // If user is a dietitian, reassign clients
    if (user.role === 'dietitian') {
      await Client.updateMany(
        { assignedDietitian: id },
        { assignedDietitian: null }
      );
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const getPlatformAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const userStats = await User.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);

    const mealPlanStats = await MealPlan.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          avgCalories: { $avg: '$totalCalories' },
        },
      },
    ]);

    const progressStats = await Progress.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          avgAdherence: { $avg: '$adherencePercentage' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        userStats,
        mealPlanStats: mealPlanStats[0] || {},
        progressStats: progressStats[0] || {},
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllDietitians,
  approveDietitian,
  rejectDietitian,
  deleteUser,
  getPlatformAnalytics,
};
