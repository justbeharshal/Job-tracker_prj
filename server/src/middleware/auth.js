const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/response');

/**
 * Verifies the JWT from the Authorization header.
 * On success: attaches req.user = { id, email, name } and calls next().
 * On failure: responds with 401.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'No token provided', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach only the fields needed downstream — no password hash
    req.user = {
      id:    decoded.id,
      email: decoded.email,
      name:  decoded.name,
    };
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 'Token expired, please log in again', 401);
    }
    return sendError(res, 'Invalid token', 401);
  }
}

module.exports = authMiddleware;
