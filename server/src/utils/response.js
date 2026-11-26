/**
 * Uniform response helpers.
 * All API responses follow: { success, data?, message? }
 */

/**
 * @param {import('express').Response} res
 * @param {any} data
 * @param {string} [message]
 * @param {number} [statusCode=200]
 */
function sendSuccess(res, data, message = '', statusCode = 200) {
  const body = { success: true };
  if (data !== undefined && data !== null) body.data = data;
  if (message) body.message = message;
  return res.status(statusCode).json(body);
}

/**
 * @param {import('express').Response} res
 * @param {string} message
 * @param {number} [statusCode=500]
 */
function sendError(res, message, statusCode = 500) {
  return res.status(statusCode).json({ success: false, message });
}

module.exports = { sendSuccess, sendError };
