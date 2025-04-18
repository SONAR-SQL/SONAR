const mongoose = require('mongoose');

const whaleActivitySchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['transfer', 'swap', 'liquidity', 'mint', 'other'],
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    token: {
      type: String, // Token address
      required: true,
    },
    tokenSymbol: {
      type: String,
      required: true,
    },
    transactionHash: {
      type: String,
      required: true,
      unique: true,
    },
    blockNumber: {
      type: Number,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    metadata: {
      type: Object, // Additional info such as counterparty, exchange, etc.
    },
  },
  { timestamps: true }
);

// Compound indexes to speed up queries
whaleActivitySchema.index({ address: 1, timestamp: -1 });
whaleActivitySchema.index({ token: 1, timestamp: -1 });

const WhaleActivity = mongoose.model('WhaleActivity', whaleActivitySchema);

module.exports = WhaleActivity; 