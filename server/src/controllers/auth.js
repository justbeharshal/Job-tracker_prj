const authService     = require('../services/authService');
const { sendSuccess } = require('../utils/response');

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    return sendSuccess(res, result, 'Account created successfully', 201);
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    return sendSuccess(res, result, 'Login successful');
  } catch (err) {
    return next(err);
  }
}

async function getMe(req, res, next) {
  try {
    const user = await authService.getMe(req.user.id);
    return sendSuccess(res, { user });
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login, getMe };
