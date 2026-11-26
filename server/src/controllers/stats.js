const statsService    = require('../services/statsService');
const { sendSuccess } = require('../utils/response');

async function getStats(req, res, next) {
  try {
    const stats = await statsService.getStats(req.user.id);
    return sendSuccess(res, stats);
  } catch (err) {
    return next(err);
  }
}

module.exports = { getStats };
