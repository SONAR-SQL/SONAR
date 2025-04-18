const mongoose = require('mongoose');

const whaleWalletSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      unique: true,
    },
    label: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
    lastActive: {
      type: Date,
      default: Date.now,
    },
    totalValue: {
      type: Number,
      default: 0,
    },
    transactions: {
      type: Number,
      default: 0,
    },
    followers: {
      type: Number,
      default: 0,
    },
    holdingTokens: [
      {
        token: String, // Token address
        symbol: String,
        amount: Number,
        value: Number,
      },
    ],
    metadata: {
      type: Object, // Additional information
    },
  },
  { timestamps: true }
);

// Indexes
whaleWalletSchema.index({ totalValue: -1 });
whaleWalletSchema.index({ lastActive: -1 });

const WhaleWallet = mongoose.model('WhaleWallet', whaleWalletSchema);

module.exports = WhaleWallet; 