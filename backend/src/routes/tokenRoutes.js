const express = require('express');
const router = express.Router();
const {
  getAllTokens,
  getTopTokens,
  getTokenById,
  getTokenByAddress,
  searchTokens,
  getTokenPriceHistory,
  updateTokenPrices,
} = require('../controllers/tokenController');
const { protect, admin } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/tokens
 * @desc    Get all tokens with pagination
 * @access  Public
 */
router.get('/', getAllTokens);

/**
 * @route   GET /api/tokens/top
 * @desc    Get top tokens by market cap
 * @access  Public
 */
router.get('/top', getTopTokens);

/**
 * @route   GET /api/tokens/search
 * @desc    Search tokens by name or symbol
 * @access  Public
 */
router.get('/search', searchTokens);

/**
 * @route   GET /api/tokens/address/:address
 * @desc    Get token by contract address
 * @access  Public
 */
router.get('/address/:address', getTokenByAddress);

/**
 * @route   GET /api/tokens/:id
 * @desc    Get token by ID
 * @access  Public
 */
router.get('/:id', getTokenById);

/**
 * @route   GET /api/tokens/:id/history
 * @desc    Get token price history
 * @access  Public
 */
router.get('/:id/history', getTokenPriceHistory);

/**
 * @route   POST /api/tokens/update-prices
 * @desc    Update token prices from external API
 * @access  Private/Admin
 */
router.post('/update-prices', protect, admin, updateTokenPrices);

module.exports = router; 