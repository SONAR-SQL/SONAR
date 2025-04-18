const tokenService = require('../services/tokenService');
const { asyncHandler } = require('../utils/asyncHandler');
const { createError } = require('../utils/errorHandler');

/**
 * @desc    Get all tokens
 * @route   GET /api/tokens
 * @access  Public
 */
const getAllTokens = asyncHandler(async (req, res) => {
  const { limit = 100, offset = 0 } = req.query;
  
  const tokens = await tokenService.getAllTokens(
    parseInt(limit, 10),
    parseInt(offset, 10)
  );
  
  res.status(200).json(tokens);
});

/**
 * @desc    Get top tokens
 * @route   GET /api/tokens/top
 * @access  Public
 */
const getTopTokens = asyncHandler(async (req, res) => {
  const { limit = 100 } = req.query;
  
  const tokens = await tokenService.getTopTokens(parseInt(limit, 10));
  
  res.status(200).json(tokens);
});

/**
 * @desc    Get token by ID
 * @route   GET /api/tokens/:id
 * @access  Public
 */
const getTokenById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const token = await tokenService.getTokenById(id);
  
  res.status(200).json(token);
});

/**
 * @desc    Get token by address
 * @route   GET /api/tokens/address/:address
 * @access  Public
 */
const getTokenByAddress = asyncHandler(async (req, res) => {
  const { address } = req.params;
  const { network = 'ethereum' } = req.query;
  
  const token = await tokenService.getTokenByAddress(address, network);
  
  res.status(200).json(token);
});

/**
 * @desc    Search tokens
 * @route   GET /api/tokens/search
 * @access  Public
 */
const searchTokens = asyncHandler(async (req, res) => {
  const { query, network, limit = 20, offset = 0 } = req.query;
  
  const tokens = await tokenService.searchTokens({
    query,
    network,
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10)
  });
  
  res.status(200).json(tokens);
});

/**
 * @desc    Get token price history
 * @route   GET /api/tokens/:id/history
 * @access  Public
 */
const getTokenPriceHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { timeframe = '7d' } = req.query;
  
  // Validate timeframe parameter
  const validTimeframes = ['1d', '7d', '30d', '90d', '1y', 'all'];
  if (!validTimeframes.includes(timeframe)) {
    throw createError(
      `Invalid timeframe. Valid values: ${validTimeframes.join(', ')}`,
      400
    );
  }
  
  const priceHistory = await tokenService.getTokenPriceHistory(id, timeframe);
  
  res.status(200).json(priceHistory);
});

/**
 * @desc    Update all token prices (from external API)
 * @route   POST /api/tokens/update-prices
 * @access  Private/Admin
 */
const updateTokenPrices = asyncHandler(async (req, res) => {
  const result = await tokenService.updateTokenPrices();
  
  res.status(200).json({
    message: 'Token prices update complete',
    result
  });
});

module.exports = {
  getAllTokens,
  getTopTokens,
  getTokenById,
  getTokenByAddress,
  searchTokens,
  getTokenPriceHistory,
  updateTokenPrices
}; 