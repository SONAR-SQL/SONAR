const express = require('express');
const tokenRoutes = require('./tokenRoutes');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const alertRoutes = require('./alertRoutes');
const whaleRoutes = require('./whaleRoutes');

const router = express.Router();

/**
 * @route   GET /api
 * @desc    API status check
 * @access  Public
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'SONAR API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount route modules
router.use('/tokens', tokenRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/alerts', alertRoutes);
router.use('/whales', whaleRoutes);

module.exports = router; 