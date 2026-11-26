const { Router } = require('express');
const { sendSuccess } = require('../utils/response');

const authRoutes         = require('./auth');
const applicationRoutes  = require('./applications');
const noteRoutes         = require('./notes');
const statsRoutes        = require('./stats');

const router = Router();

// Health check — no auth, no DB query
router.get('/health', (_req, res) => {
  sendSuccess(res, null, 'ok');
});

// Feature routes
router.use('/auth',         authRoutes);
router.use('/applications', applicationRoutes);
router.use('/notes',        noteRoutes);
router.use('/stats',        statsRoutes);

module.exports = router;
