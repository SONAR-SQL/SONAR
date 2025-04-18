const mongoose = require('mongoose');

const alertSettingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['whale_movement', 'price_change', 'volume_spike', 'custom'],
      required: true,
    },
    name: {
      type: String,
      // Required for custom alerts
    },
    description: {
      type: String,
      // Description for custom alerts
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    minAmount: {
      type: Number, // Minimum amount threshold for large transaction monitoring
    },
    threshold: {
      type: Number, // Percentage threshold for price changes and volume spikes
    },
    tokens: [
      {
        type: String, // Monitored token addresses
      },
    ],
    customCondition: {
      type: String, // Custom condition expression
    },
    notificationChannels: {
      email: {
        type: Boolean,
        default: false,
      },
      push: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true }
);

// Create indexes
alertSettingSchema.index({ user: 1, type: 1 });

const AlertSetting = mongoose.model('AlertSetting', alertSettingSchema);

module.exports = AlertSetting; 