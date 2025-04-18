const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Register new user
router.post('/register', authController.register);

// User login
router.post('/login', authController.login);

// Get current user info
router.get('/me', protect, authController.getMe);

// Update user info
router.put('/profile', protect, authController.updateProfile);

module.exports = router; 