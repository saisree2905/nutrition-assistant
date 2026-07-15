const MealPlan = require('../models/MealPlan');
const Client = require('../models/Client');
const User = require('../models/User');
const { sendMealPlanNotification } = require('../utils/emailService');

const getMealPlans = async (req, res, next) => {
  try {
    const { clientId, page = 1, limit = 10, startDate, endDate } = req.query;

    const query = {};

    if (clientId) {
      const client = await Client.findById(clientId);
      if (!client) {
        return res.status(404).json({
          success: false,
          message: 'Client not found',
        });
      }

      if (client.userId.toString() !== req.user._id.toString() &&
          client.assignedDietitian.toString() !== req.user._id.toString() &&
          req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access these meal plans',
        });
      }

      query.clientId = clientId;
    } else if (req.user.role === 'dietitian') {
      query.createdBy = req.user._id;
    } else if (req.user.role === 'user') {
      const client = await Client.findOne({ userId: req.user._id });
      if (client) {
        query.clientId = client._id;
      }
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const mealPlans = await MealPlan.find(query)
      .populate('clientId', 'userId')
      .populate('createdBy', 'name email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ date: -1 });

    const total = await MealPlan.countDocuments(query);

    res.status(200).json({
      success: true,
      data: mealPlans,
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

const getMealPlanById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const mealPlan = await MealPlan.findById(id)
      .populate('clientId', 'userId targetCalories targetProtein targetCarbs targetFat')
      .populate('createdBy', 'name email');

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found',
      });
    }

    const client = await Client.findById(mealPlan.clientId._id);

    if (mealPlan.createdBy._id.toString() !== req.user._id.toString() &&
        client.userId.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this meal plan',
      });
    }

    res.status(200).json({
      success: true,
      data: mealPlan,
    });
  } catch (error) {
    next(error);
  }
};

const createMealPlan = async (req, res, next) => {
  try {
    const { clientId, breakfast, lunch, dinner, snacks, totalCalories, totalProtein, totalCarbs, totalFat, date, notes } = req.body;

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    if (client.assignedDietitian.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create meal plans for this client',
      });
    }

    const mealPlan = new MealPlan({
      clientId,
      breakfast: breakfast || [],
      lunch: lunch || [],
      dinner: dinner || [],
      snacks: snacks || [],
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      createdBy: req.user._id,
      date: new Date(date),
      notes,
    });

    await mealPlan.save();
    await mealPlan.populate('clientId', 'userId');
    await mealPlan.populate('createdBy', 'name email');

    // Send notification to client
    try {
      const user = await User.findById(client.userId);
      await sendMealPlanNotification(user.email, user.name, new Date(date).toLocaleDateString());
    } catch (error) {
      console.error('Failed to send notification:', error);
    }

    res.status(201).json({
      success: true,
      message: 'Meal plan created successfully',
      data: mealPlan,
    });
  } catch (error) {
    next(error);
  }
};

const updateMealPlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const mealPlan = await MealPlan.findById(id);
    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found',
      });
    }

    if (mealPlan.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this meal plan',
      });
    }

    const allowedUpdates = [
      'breakfast',
      'lunch',
      'dinner',
      'snacks',
      'totalCalories',
      'totalProtein',
      'totalCarbs',
      'totalFat',
      'date',
      'notes',
      'isActive',
    ];

    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        mealPlan[key] = updates[key];
      }
    });

    mealPlan.updatedAt = Date.now();
    await mealPlan.save();

    await mealPlan.populate('clientId', 'userId');
    await mealPlan.populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Meal plan updated successfully',
      data: mealPlan,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMealPlan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const mealPlan = await MealPlan.findById(id);
    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found',
      });
    }

    if (mealPlan.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this meal plan',
      });
    }

    await MealPlan.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Meal plan deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMealPlans,
  getMealPlanById,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
};
