const TokenData = require('../models/TokenData');
const User = require('../models/User');

// Get market overview with trending tokens
exports.getMarketOverview = async (req, res, next) => {
  try {
    // Get top tokens by volume
    const topVolumeTokens = await TokenData.find()
      .sort({ volume24h: -1 })
      .limit(10)
      .lean();
    
    // Get top gainers
    const topGainers = await TokenData.find({ priceChange24h: { $gt: 0 } })
      .sort({ priceChange24h: -1 })
      .limit(5)
      .lean();
    
    // Get top losers
    const topLosers = await TokenData.find({ priceChange24h: { $lt: 0 } })
      .sort({ priceChange24h: 1 })
      .limit(5)
      .lean();
    
    // Get tokens with high whale interest
    const whaleInterestTokens = await TokenData.find()
      .sort({ whaleInterest: -1 })
      .limit(5)
      .lean();
    
    res.status(200).json({
      success: true,
      data: {
        topVolumeTokens,
        topGainers,
        topLosers,
        whaleInterestTokens
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get token details by address
exports.getTokenDetails = async (req, res, next) => {
  try {
    const { address } = req.params;
    
    const token = await TokenData.findOne({ address });
    
    if (!token) {
      return res.status(404).json({
        success: false,
        message: 'Token not found'
      });
    }
    
    res.status(200).json({
      success: true,
      token
    });
  } catch (error) {
    next(error);
  }
};

// Get token price history
exports.getTokenPriceHistory = async (req, res, next) => {
  try {
    const { address } = req.params;
    const { period = '24h' } = req.query;
    
    const token = await TokenData.findOne({ address });
    
    if (!token) {
      return res.status(404).json({
        success: false,
        message: 'Token not found'
      });
    }
    
    // In a real implementation, we would filter historical data based on the period
    // For now, we'll just return all available historical data
    const priceHistory = token.historicalData || [];
    
    res.status(200).json({
      success: true,
      data: {
        symbol: token.symbol,
        name: token.name,
        priceHistory
      }
    });
  } catch (error) {
    next(error);
  }
};

// Search tokens
exports.searchTokens = async (req, res, next) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const tokens = await TokenData.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { symbol: { $regex: query, $options: 'i' } },
        { address: { $regex: query, $options: 'i' } }
      ]
    }).limit(10);
    
    res.status(200).json({
      success: true,
      tokens
    });
  } catch (error) {
    next(error);
  }
};

// Get user's watchlist
exports.getWatchlist = async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    // Get user's watchlist token addresses
    const user = await User.findById(userId).select('watchlist');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // If watchlist is empty, return empty array
    if (!user.watchlist || user.watchlist.length === 0) {
      return res.status(200).json({
        success: true,
        watchlist: []
      });
    }
    
    // Get token details for each token in watchlist
    const watchlistTokens = await TokenData.find({
      address: { $in: user.watchlist }
    }).lean();
    
    res.status(200).json({
      success: true,
      watchlist: watchlistTokens
    });
  } catch (error) {
    next(error);
  }
};

// Add token to user's watchlist
exports.addToWatchlist = async (req, res, next) => {
  try {
    const { address } = req.body;
    const userId = req.user._id;
    
    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Token address is required'
      });
    }
    
    // Check if token exists
    const token = await TokenData.findOne({ address });
    
    if (!token) {
      return res.status(404).json({
        success: false,
        message: 'Token not found'
      });
    }
    
    // Add to user's watchlist if not already there
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { watchlist: address } },
      { new: true }
    ).select('watchlist');
    
    res.status(200).json({
      success: true,
      watchlist: updatedUser.watchlist
    });
  } catch (error) {
    next(error);
  }
};

// Remove token from user's watchlist
exports.removeFromWatchlist = async (req, res, next) => {
  try {
    const { address } = req.params;
    const userId = req.user._id;
    
    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Token address is required'
      });
    }
    
    // Remove from user's watchlist
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { watchlist: address } },
      { new: true }
    ).select('watchlist');
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      watchlist: updatedUser.watchlist,
      message: 'Token removed from watchlist'
    });
  } catch (error) {
    next(error);
  }
}; 