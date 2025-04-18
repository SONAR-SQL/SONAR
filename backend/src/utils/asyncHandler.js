/**
 * Async handler wrapper to eliminate try-catch blocks in route handlers
 * 
 * @param {Function} fn - Async function to be wrapped
 * @returns {Function} Express middleware function that catches errors
 * 
 * @example
 * // Instead of:
 * router.get('/', async (req, res, next) => {
 *   try {
 *     // Controller logic
 *   } catch (err) {
 *     next(err);
 *   }
 * });
 * 
 * // You can use:
 * router.get('/', asyncHandler(async (req, res) => {
 *   // Controller logic
 * }));
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  asyncHandler
}; 