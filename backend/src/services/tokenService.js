const axios = require('axios');
const Token = require('../models/Token');
const PriceData = require('../models/PriceData');
const { createError } = require('../utils/errorHandler');

/**
 * Token Service - Handles token-related business logic
 */
class TokenService {
  /**
   * Get all tokens list
   */
  async getAllTokens(limit = 100, offset = 0) {
    try {
      const tokens = await Token.find()
        .sort({ rank: 1 })
        .skip(offset)
        .limit(limit);
      
      return tokens;
    } catch (error) {
      throw createError('Failed to get token list', 500, error);
    }
  }
  
  /**
   * Get top tokens list
   */
  async getTopTokens(limit = 100) {
    try {
      const tokens = await Token.find()
        .sort({ marketCap: -1 })
        .limit(limit);
      
      return tokens;
    } catch (error) {
      throw createError('Failed to get top tokens', 500, error);
    }
  }
  
  /**
   * Get token by ID
   */
  async getTokenById(id) {
    try {
      const token = await Token.findById(id);
      
      if (!token) {
        throw createError('Token not found', 404);
      }
      
      return token;
    } catch (error) {
      if (error.statusCode) throw error;
      throw createError(`Failed to get token details: ${error.message}`, 500, error);
    }
  }
  
  /**
   * Get token by contract address
   */
  async getTokenByAddress(address, network = 'ethereum') {
    try {
      const token = await Token.findOne({ 
        address: address.toLowerCase(),
        network
      });
      
      if (!token) {
        throw createError('Token not found', 404);
      }
      
      return token;
    } catch (error) {
      if (error.statusCode) throw error;
      throw createError(`Failed to get token details: ${error.message}`, 500, error);
    }
  }
  
  /**
   * Search tokens
   */
  async searchTokens({ query, network, limit = 20, offset = 0 }) {
    try {
      let filter = {};
      
      if (query) {
        filter.$or = [
          { name: { $regex: query, $options: 'i' } },
          { symbol: { $regex: query, $options: 'i' } }
        ];
      }
      
      if (network) {
        filter.network = network;
      }
      
      const tokens = await Token.find(filter)
        .sort({ marketCap: -1 })
        .skip(offset)
        .limit(limit);
      
      return tokens;
    } catch (error) {
      throw createError('Failed to search tokens', 500, error);
    }
  }
  
  /**
   * Get token price history data
   */
  async getTokenPriceHistory(tokenId, timeframe = '7d') {
    try {
      // Check if token exists
      const token = await Token.findById(tokenId);
      if (!token) {
        throw createError('Token not found', 404);
      }
      
      // Determine query parameters based on timeframe
      const now = new Date();
      let startTime;
      
      switch (timeframe) {
        case '1d':
          startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startTime = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '1y':
          startTime = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        case 'all':
          startTime = new Date(0); // Start from beginning
          break;
        default:
          startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Default 7d
      }
      
      // Query price data
      const priceData = await PriceData.find({
        token: tokenId,
        timestamp: { $gte: startTime }
      }).sort({ timestamp: 1 });
      
      return priceData;
    } catch (error) {
      if (error.statusCode) throw error;
      throw createError(`Failed to get price history: ${error.message}`, 500, error);
    }
  }
  
  /**
   * Update token price data (via external API)
   */
  async updateTokenPrices() {
    try {
      // Get all tokens
      const tokens = await Token.find().select('_id symbol');
      
      // For each token, get and update price info
      const updates = tokens.map(async (token) => {
        try {
          // This assumes there's an external API to get price data
          // Real implementation might need to be replaced with an actual API
          const priceData = await this.fetchTokenPriceFromAPI(token.symbol);
          
          // Update token
          await Token.findByIdAndUpdate(token._id, {
            price: priceData.price,
            priceChange24h: priceData.priceChange24h,
            marketCap: priceData.marketCap,
            volume24h: priceData.volume24h,
            updatedAt: new Date()
          });
          
          // Create price data point
          await PriceData.create({
            token: token._id,
            price: priceData.price,
            volume: priceData.volume24h,
            timestamp: new Date()
          });
          
          return { tokenId: token._id, success: true };
        } catch (err) {
          console.error(`Failed to update token ${token.symbol} price:`, err);
          return { tokenId: token._id, success: false, error: err.message };
        }
      });
      
      // Wait for all updates to complete
      const results = await Promise.all(updates);
      
      // Return update results
      return {
        total: results.length,
        succeeded: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        details: results
      };
    } catch (error) {
      throw createError('Failed to update token prices', 500, error);
    }
  }
  
  /**
   * Fetch token price data from external API
   * Note: This is a mock implementation, should be replaced with a real API call in production
   */
  async fetchTokenPriceFromAPI(symbol) {
    try {
      // In a real application, should call an actual price API like CoinGecko, CoinMarketCap, etc.
      // Below is mock data
      return {
        price: Math.random() * 10000,
        priceChange24h: (Math.random() * 20) - 10, // -10% to +10%
        marketCap: Math.random() * 1000000000,
        volume24h: Math.random() * 100000000
      };
      
      // Real API call might look like:
      // const response = await axios.get(`https://api.example.com/v1/tokens/${symbol}`);
      // return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch token price data: ${error.message}`);
    }
  }
}

module.exports = new TokenService(); 