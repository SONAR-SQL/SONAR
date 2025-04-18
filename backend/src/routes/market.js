const express = require('express');
const marketController = require('../controllers/marketController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Get market overview
router.get('/overview', marketController.getMarketOverview);

// Get token details
router.get('/token/:address', marketController.getTokenDetails);

// Get token price history
router.get('/token/:address/history', marketController.getTokenPriceHistory);

// Search tokens
router.get('/search', marketController.searchTokens);

// Watchlist routes (all require authentication)
router.get('/watchlist', protect, marketController.getWatchlist);
router.post('/watchlist', protect, marketController.addToWatchlist);
router.delete('/watchlist/:address', protect, marketController.removeFromWatchlist);

module.exports = router; 