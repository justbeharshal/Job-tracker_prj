const { Router }     = require('express');
const statsController = require('../controllers/stats');
const authMiddleware  = require('../middleware/auth');

const router = Router();

// GET /api/stats
router.get('/', authMiddleware, statsController.getStats);

module.exports = router;
