/**
 * Custom Error class for API errors
 */
class ApiError extends Error {
  constructor(message, statusCode, originalError = null) {
    super(message);
    this.statusCode = statusCode;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Create a new API error with message and status code
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {Error} originalError - Original error object (optional)
 * @returns {ApiError} - New API error
 */
const createError = (message, statusCode, originalError = null) => {
  return new ApiError(message, statusCode, originalError);
};

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error(`Error: ${err.message}`);
  if (err.originalError) {
    console.error('Original error:', err.originalError);
  }
  console.error(err.stack);
  
  // Default error response
  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    timestamp: err.timestamp || new Date().toISOString()
  };
  
  // Add original error details in development
  if (process.env.NODE_ENV === 'development' && err.originalError) {
    response.originalError = {
      message: err.originalError.message,
      stack: err.originalError.stack
    };
  }
  
  res.status(statusCode).json(response);
};

/**
 * Not found middleware for handling undefined routes
 */
const notFound = (req, res, next) => {
  const error = createError(`Route not found: ${req.originalUrl}`, 404);
  next(error);
};

module.exports = {
  ApiError,
  createError,
  errorHandler,
  notFound
}; 