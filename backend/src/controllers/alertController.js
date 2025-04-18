const Alert = require('../models/Alert');
const AlertSetting = require('../models/AlertSetting');
const User = require('../models/User');

// Get user alerts
exports.getAlerts = async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    // Get alerts in descending order by creation date
    const alerts = await Alert.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
      
    res.status(200).json({
      success: true,
      alerts,
    });
  } catch (error) {
    next(error);
  }
};

// Mark alert as read
exports.markAsRead = async (req, res, next) => {
  try {
    const alertId = req.params.id;
    const userId = req.user._id;
    
    const alert = await Alert.findOneAndUpdate(
      { _id: alertId, user: userId },
      { read: true },
      { new: true }
    );
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found',
      });
    }
    
    res.status(200).json({
      success: true,
      alert,
    });
  } catch (error) {
    next(error);
  }
};

// Mark all alerts as read
exports.markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    await Alert.updateMany(
      { user: userId, read: false },
      { read: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'All alerts marked as read',
    });
  } catch (error) {
    next(error);
  }
};

// Get alert settings
exports.getSettings = async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    const settings = await AlertSetting.find({ user: userId }).lean();
    
    // If no settings exist, create default settings
    if (settings.length === 0) {
      const defaultSettings = [
        {
          user: userId,
          type: 'whale_movement',
          enabled: true,
          minAmount: 100000, // $100,000
        },
        {
          user: userId,
          type: 'price_change',
          enabled: true,
          threshold: 10, // 10%
        },
        {
          user: userId,
          type: 'volume_spike',
          enabled: true,
          threshold: 200, // 200%
        },
      ];
      
      const createdSettings = await AlertSetting.insertMany(defaultSettings);
      
      return res.status(200).json({
        success: true,
        settings: createdSettings,
      });
    }
    
    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    next(error);
  }
};

// Update alert setting
exports.updateSetting = async (req, res, next) => {
  try {
    const settingId = req.params.id;
    const userId = req.user._id;
    
    // Check if setting exists and belongs to current user
    const existingSetting = await AlertSetting.findOne({
      _id: settingId,
      user: userId,
    });
    
    if (!existingSetting) {
      return res.status(404).json({
        success: false,
        message: 'Alert setting not found',
      });
    }
    
    // Update setting
    const setting = await AlertSetting.findByIdAndUpdate(
      settingId,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      setting,
    });
  } catch (error) {
    next(error);
  }
};

// Create alert setting
exports.createSetting = async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    // Create setting
    const setting = await AlertSetting.create({
      ...req.body,
      user: userId,
    });
    
    res.status(201).json({
      success: true,
      setting,
    });
  } catch (error) {
    next(error);
  }
};

// Create custom alert
exports.createCustomAlert = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { title, description, token, tokenSymbol, severity } = req.body;
    
    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }
    
    // Create custom alert
    const alert = await Alert.create({
      user: userId,
      type: 'custom',
      severity: severity || 'medium',
      title,
      description,
      token,
      tokenSymbol,
      read: false,
      active: true
    });
    
    res.status(201).json({
      success: true,
      alert
    });
  } catch (error) {
    next(error);
  }
};

// Delete alert
exports.deleteAlert = async (req, res, next) => {
  try {
    const alertId = req.params.id;
    const userId = req.user._id;
    
    const alert = await Alert.findOneAndDelete({
      _id: alertId,
      user: userId
    });
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Alert deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete all alerts
exports.deleteAllAlerts = async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    const result = await Alert.deleteMany({
      user: userId
    });
    
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} alerts deleted successfully`
    });
  } catch (error) {
    next(error);
  }
};

// Create custom alert setting
exports.createCustomSetting = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { 
      name, 
      condition, 
      tokens, 
      notificationChannels,
      description
    } = req.body;
    
    // Validate required fields
    if (!name || !condition) {
      return res.status(400).json({
        success: false,
        message: 'Name and condition are required'
      });
    }
    
    // Create custom alert setting
    const setting = await AlertSetting.create({
      user: userId,
      type: 'custom',
      enabled: true,
      tokens: tokens || [],
      customCondition: condition,
      description: description || `Custom alert: ${name}`,
      name,
      notificationChannels: notificationChannels || {
        email: false,
        push: true
      }
    });
    
    res.status(201).json({
      success: true,
      setting
    });
  } catch (error) {
    next(error);
  }
};

// Delete setting
exports.deleteSetting = async (req, res, next) => {
  try {
    const settingId = req.params.id;
    const userId = req.user._id;
    
    const setting = await AlertSetting.findOneAndDelete({
      _id: settingId,
      user: userId
    });
    
    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Alert setting not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Alert setting deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}; 