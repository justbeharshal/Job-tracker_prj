const { Router } = require('express');
const authController = require('../controllers/auth');
const validate       = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');
const { registerSchema, loginSchema } = require('../validators/authValidator');

const router = Router();

// POST /api/auth/register
router.post('/register', validate(registerSchema), authController.register);

// POST /api/auth/login
router.post('/login', validate(loginSchema), authController.login);

// GET /api/auth/me  — protected
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
