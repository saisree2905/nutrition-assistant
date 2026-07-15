const Client = require('../models/Client');
const User = require('../models/User');
const Progress = require('../models/Progress');
const { sendMealPlanNotification } = require('../utils/emailService');

const getAllClients = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const query = {
      assignedDietitian: req.user._id,
    };

    if (search) {
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      });
      const userIds = users.map(u => u._id);
      query.userId = { $in: userIds };
    }

    const skip = (page - 1) * limit;
    const clients = await Client.find(query)
      .populate('userId', 'name email phone weight BMI')
      .populate('assignedDietitian', 'name email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Client.countDocuments(query);

    res.status(200).json({
      success: true,
      data: clients,
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

const getClientById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const client = await Client.findById(id)
      .populate('userId', 'name email phone gender age height weight BMI allergies medicalConditions goals activityLevel')
      .populate('assignedDietitian', 'name email phone');

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    if (client.assignedDietitian._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this client',
      });
    }

    // Get progress summary
    const progressRecords = await Progress.find({ clientId: id }).sort({ date: -1 }).limit(30);
    const weeklyProgress = await Progress.find({
      clientId: id,
      date: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.status(200).json({
      success: true,
      data: {
        client,
        progressRecords,
        weeklyStats: {
          averageCalories: Math.round(
            weeklyProgress.reduce((sum, p) => sum + p.caloriesConsumed, 0) / weeklyProgress.length || 0
          ),
          averageWaterIntake: Math.round(
            weeklyProgress.reduce((sum, p) => sum + p.waterIntake, 0) / weeklyProgress.length || 0
          ) / 10,
          averageExercise: Math.round(
            weeklyProgress.reduce((sum, p) => sum + p.exerciseMinutes, 0) / weeklyProgress.length || 0
          ),
          averageAdherence: Math.round(
            weeklyProgress.reduce((sum, p) => sum + p.adherencePercentage, 0) / weeklyProgress.length || 0
          ),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const createClient = async (req, res, next) => {
  try {
    const { userId, targetCalories, targetProtein, targetCarbs, targetFat, notes } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const existingClient = await Client.findOne({ userId });
    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: 'Client profile already exists for this user',
      });
    }

    const client = new Client({
      userId,
      assignedDietitian: req.user._id,
      targetCalories,
      targetProtein,
      targetCarbs,
      targetFat,
      notes,
    });

    await client.save();
    await client.populate('userId', 'name email');
    await client.populate('assignedDietitian', 'name email');

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

const updateClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    if (client.assignedDietitian.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this client',
      });
    }

    const allowedUpdates = [
      'targetCalories',
      'targetProtein',
      'targetCarbs',
      'targetFat',
      'notes',
      'isActive',
    ];

    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        client[key] = updates[key];
      }
    });

    client.updatedAt = Date.now();
    await client.save();

    await client.populate('userId', 'name email');
    await client.populate('assignedDietitian', 'name email');

    res.status(200).json({
      success: true,
      message: 'Client updated successfully',
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

const deleteClient = async (req, res, next) => {
  try {
    const { id } = req.params;

    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    if (client.assignedDietitian.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this client',
      });
    }

    await Progress.deleteMany({ clientId: id });
    await Client.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Client deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};
