const express = require('express');
const router = express.Router();
const whaleController = require('../controllers/whaleController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Get top whale wallets
router.get('/top', whaleController.getTopWhales);

// Get recent whale activities
router.get('/activities', whaleController.getRecentActivities);

// Track wallet (accessible without login, but saves to user account if logged in)
router.post('/track', whaleController.trackWallet);

// Get wallet details
router.get('/wallet/:address', whaleController.getWalletDetail);

// Get user tracked wallets (requires login)
router.get('/tracked', protect, whaleController.getTrackedWallets);

// Untrack wallet (requires login)
router.delete('/tracked/:address', protect, whaleController.untrackWallet);

module.exports = router; 