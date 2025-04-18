const mongoose = require('mongoose');

const priceDataSchema = new mongoose.Schema(
  {
    token: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Token',
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
    },
    volume: {
      type: Number,
      default: 0,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: false } // No need for auto-created timestamps
);

// Create compound index to speed up common queries
priceDataSchema.index({ token: 1, timestamp: 1 });

// Convert to API-friendly format
priceDataSchema.methods.toJSON = function() {
  const priceData = this.toObject();
  delete priceData._id;
  delete priceData.__v;
  return priceData;
};

const PriceData = mongoose.model('PriceData', priceDataSchema);

module.exports = PriceData; 