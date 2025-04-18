const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { createError } = require('../utils/errorHandler');
const { asyncHandler } = require('../utils/asyncHandler');

/**
 * Protect routes - Verify user is authenticated
 * @route Any protected route
 * @access Private
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;
  
  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (remove Bearer prefix)
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Add user to request object (without password)
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        throw createError('User not found', 401);
      }
      
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw createError('Invalid token', 401);
      } else if (error.name === 'TokenExpiredError') {
        throw createError('Token expired', 401);
      } else {
        throw error;
      }
    }
  }
  
  if (!token) {
    throw createError('Not authorized - No token provided', 401);
  }
});

/**
 * Admin middleware - Verify user is an admin
 * @route Any admin route
 * @access Private/Admin
 */
const admin = asyncHandler(async (req, res, next) => {
  // Requires protect middleware to be called first
  if (!req.user) {
    throw createError('Not authorized', 401);
  }
  
  if (req.user.role !== 'admin') {
    throw createError('Not authorized as admin', 403);
  }
  
  next();
});

module.exports = {
  protect,
  admin
}; 