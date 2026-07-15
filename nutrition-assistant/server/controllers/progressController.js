const Progress = require('../models/Progress');
const Client = require('../models/Client');

const getProgress = async (req, res, next) => {
  try {
    const { clientId, page = 1, limit = 20, startDate, endDate } = req.query;

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
          message: 'Not authorized to access this progress',
        });
      }

      query.clientId = clientId;
    } else if (req.user.role === 'user') {
      const client = await Client.findOne({ userId: req.user._id });
      if (client) {
        query.clientId = client._id;
      }
    } else if (req.user.role === 'dietitian') {
      const clients = await Client.find({ assignedDietitian: req.user._id }, '_id');
      const clientIds = clients.map(c => c._id);
      query.clientId = { $in: clientIds };
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const progress = await Progress.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ date: -1 });

    const total = await Progress.countDocuments(query);

    res.status(200).json({
      success: true,
      data: progress,
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

const getProgressById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const progress = await Progress.findById(id);
    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress record not found',
      });
    }

    const client = await Client.findById(progress.clientId);

    if (client.userId.toString() !== req.user._id.toString() &&
        client.assignedDietitian.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this progress',
      });
    }

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

const createProgress = async (req, res, next) => {
  try {
    const { clientId, weight, caloriesConsumed, waterIntake = 0, exerciseMinutes = 0, notes, date } = req.body;

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
        message: 'Not authorized to log progress for this client',
      });
    }

    const progressDate = date ? new Date(date) : new Date();
    progressDate.setHours(0, 0, 0, 0);

    // Check if progress already exists for this date
    const existingProgress = await Progress.findOne({
      clientId,
      date: progressDate,
    });

    if (existingProgress) {
      return res.status(400).json({
        success: false,
        message: 'Progress already logged for this date',
      });
    }

    const adherencePercentage = Math.min(
      100,
      Math.round((caloriesConsumed / client.targetCalories) * 100)
    );

    const progress = new Progress({
      clientId,
      weight,
      caloriesConsumed,
      waterIntake,
      exerciseMinutes,
      adherencePercentage,
      notes,
      date: progressDate,
    });

    await progress.save();

    res.status(201).json({
      success: true,
      message: 'Progress logged successfully',
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

const updateProgress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const progress = await Progress.findById(id);
    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress record not found',
      });
    }

    const client = await Client.findById(progress.clientId);

    if (client.userId.toString() !== req.user._id.toString() &&
        client.assignedDietitian.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this progress',
      });
    }

    const allowedUpdates = [
      'weight',
      'caloriesConsumed',
      'waterIntake',
      'exerciseMinutes',
      'notes',
    ];

    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        progress[key] = updates[key];
      }
    });

    // Recalculate adherence percentage
    if (updates.caloriesConsumed) {
      progress.adherencePercentage = Math.min(
        100,
        Math.round((updates.caloriesConsumed / client.targetCalories) * 100)
      );
    }

    progress.updatedAt = Date.now();
    await progress.save();

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProgress = async (req, res, next) => {
  try {
    const { id } = req.params;

    const progress = await Progress.findById(id);
    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress record not found',
      });
    }

    const client = await Client.findById(progress.clientId);

    if (client.userId.toString() !== req.user._id.toString() &&
        client.assignedDietitian.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this progress',
      });
    }

    await Progress.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Progress deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const getProgressStats = async (req, res, next) => {
  try {
    const { clientId, days = 30 } = req.query;

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
        message: 'Not authorized to access this progress',
      });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    startDate.setHours(0, 0, 0, 0);

    const progressRecords = await Progress.find({
      clientId,
      date: { $gte: startDate },
    }).sort({ date: 1 });

    const stats = {
      totalDays: progressRecords.length,
      averageCalories: 0,
      averageWaterIntake: 0,
      averageExercise: 0,
      averageAdherence: 0,
      weightChange: 0,
      maxCalories: 0,
      minCalories: Infinity,
    };

    if (progressRecords.length > 0) {
      const caloriesSum = progressRecords.reduce((sum, p) => sum + p.caloriesConsumed, 0);
      const waterSum = progressRecords.reduce((sum, p) => sum + p.waterIntake, 0);
      const exerciseSum = progressRecords.reduce((sum, p) => sum + p.exerciseMinutes, 0);
      const adherenceSum = progressRecords.reduce((sum, p) => sum + p.adherencePercentage, 0);

      stats.averageCalories = Math.round(caloriesSum / progressRecords.length);
      stats.averageWaterIntake = Math.round((waterSum / progressRecords.length) * 10) / 10;
      stats.averageExercise = Math.round(exerciseSum / progressRecords.length);
      stats.averageAdherence = Math.round(adherenceSum / progressRecords.length);

      stats.maxCalories = Math.max(...progressRecords.map(p => p.caloriesConsumed));
      stats.minCalories = Math.min(...progressRecords.map(p => p.caloriesConsumed));

      stats.weightChange = Math.round((progressRecords[progressRecords.length - 1].weight - progressRecords[0].weight) * 10) / 10;
    }

    res.status(200).json({
      success: true,
      data: {
        stats,
        records: progressRecords,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProgress,
  getProgressById,
  createProgress,
  updateProgress,
  deleteProgress,
  getProgressStats,
};
