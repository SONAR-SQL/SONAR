const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    address: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    network: {
      type: String,
      required: true,
      default: 'ethereum',
      enum: ['ethereum', 'binance', 'polygon', 'solana', 'avalanche'],
      index: true,
    },
    decimals: {
      type: Number,
      default: 18,
    },
    logoUrl: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: 0,
    },
    priceChange24h: {
      type: Number,
      default: 0,
    },
    marketCap: {
      type: Number,
      default: 0,
    },
    volume24h: {
      type: Number,
      default: 0,
    },
    circulatingSupply: {
      type: Number,
      default: 0,
    },
    totalSupply: {
      type: Number,
      default: 0,
    },
    rank: {
      type: Number,
      default: 9999,
      index: true,
    },
    description: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    twitter: {
      type: String,
      default: '',
    },
    github: {
      type: String,
      default: '',
    },
    coingeckoId: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Create compound indexes to speed up common queries
tokenSchema.index({ symbol: 1, network: 1 }, { unique: true });
tokenSchema.index({ isActive: 1, rank: 1 });
tokenSchema.index({ isActive: 1, marketCap: -1 });

// Convert to API-friendly format
tokenSchema.methods.toJSON = function() {
  const token = this.toObject();
  token.id = token._id;
  delete token._id;
  delete token.__v;
  return token;
};

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token; 