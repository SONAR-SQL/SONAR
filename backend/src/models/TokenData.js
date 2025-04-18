const mongoose = require('mongoose');

const tokenDataSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    priceChange24h: {
      type: Number,
      default: 0,
    },
    volume24h: {
      type: Number,
      default: 0,
    },
    marketCap: {
      type: Number,
    },
    whaleInterest: {
      type: Number, // Whale interest score 0-100
      default: 0,
    },
    riskScore: {
      type: Number, // Risk score 0-100
      default: 50,
    },
    historicalData: [
      {
        timestamp: Date,
        price: Number,
        volume: Number,
      },
    ],
    metadata: {
      type: Object, // Additional information
    },
  },
  { timestamps: true }
);

// Indexes
tokenDataSchema.index({ symbol: 1 });
tokenDataSchema.index({ whaleInterest: -1 });
tokenDataSchema.index({ priceChange24h: -1 });
tokenDataSchema.index({ volume24h: -1 });

const TokenData = mongoose.model('TokenData', tokenDataSchema);

module.exports = TokenData; 