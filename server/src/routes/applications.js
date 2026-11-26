const { Router }         = require('express');
const appController      = require('../controllers/applications');
const noteController     = require('../controllers/notes');
const authMiddleware     = require('../middleware/auth');
const validate           = require('../middleware/validate');
const {
  applicationBodySchema,
  statusPatchSchema,
  noteBodySchema,
  listQuerySchema,
} = require('../validators/applicationValidator');

const router = Router();

// All routes in this file require authentication
router.use(authMiddleware);

// GET /api/applications
router.get('/',    validate(listQuerySchema, 'query'), appController.list);

// POST /api/applications
router.post('/',   validate(applicationBodySchema),    appController.create);

// GET /api/applications/:id
router.get('/:id', appController.getById);

// PUT /api/applications/:id
router.put('/:id', validate(applicationBodySchema),    appController.update);

// PATCH /api/applications/:id/status
router.patch('/:id/status', validate(statusPatchSchema), appController.updateStatus);

// DELETE /api/applications/:id
router.delete('/:id', appController.remove);

// POST /api/applications/:id/notes
router.post('/:id/notes', validate(noteBodySchema), noteController.addNote);

module.exports = router;
