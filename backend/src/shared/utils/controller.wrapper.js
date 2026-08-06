const { errorResponse } = require('./response.helper');

/**
 * Wraps a controller function to handle try-catch blocks and error responses automatically.
 * Supports both synchronous and asynchronous functions.
 * 
 * @param {Function} fn - The controller function to wrap
 * @param {number} defaultErrorStatus - The default HTTP status code for errors (defaults to 400)
 * @returns {Function} Express middleware function
 */
const catchError = (fn, defaultErrorStatus = 400) => (req, res, next) => {
  try {
    const result = fn(req, res, next);
    if (result && result.catch) {
      return result.catch(err => {
        console.error('Async Controller Error:', err);
        const statusCode = err.statusCode || (err.message && err.message.toLowerCase().includes('yetki') ? 403 : defaultErrorStatus);
        return errorResponse(res, err.message, statusCode);
      });
    }
    return result;
  } catch (err) {
    console.error('Sync Controller Error:', err);
    const statusCode = err.statusCode || (err.message && err.message.toLowerCase().includes('yetki') ? 403 : defaultErrorStatus);
    return errorResponse(res, err.message, statusCode);
  }
};

module.exports = { catchError };
