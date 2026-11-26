const { Router }     = require('express');
const noteController = require('../controllers/notes');
const authMiddleware = require('../middleware/auth');

const router = Router();

// DELETE /api/notes/:id
router.delete('/:id', authMiddleware, noteController.deleteNote);

module.exports = router;
