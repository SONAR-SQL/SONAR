const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes middleware
exports.protect = async (req, res, next) => {
  let token;

  // Get token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized, please login to access',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User does not exist',
      });
    }

    // Add user info to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token, please login again',
    });
  }
};

// Role restriction middleware
exports.restrictTo = (...subscriptions) => {
  return (req, res, next) => {
    if (!subscriptions.includes(req.user.subscription)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action, please upgrade your subscription',
      });
    }
    next();
  };
}; 