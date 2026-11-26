const { sendError } = require('../utils/response');

/**
 * Global Express error handler.
 * Must be the LAST middleware registered in app.js.
 *
 * Usage: throw an Error or call next(err) from any route/controller.
 * Attach err.statusCode to control the HTTP status (defaults to 500).
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Log stack in development; keep it quiet in production
  if (process.env.NODE_ENV !== 'production') {
    console.error('💥 Error:', err.stack || err.message);
  } else {
    console.error('💥 Error:', err.message);
  }

  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500 ? 'Internal server error' : err.message;

  return sendError(res, message, statusCode);
}

module.exports = errorHandler;
