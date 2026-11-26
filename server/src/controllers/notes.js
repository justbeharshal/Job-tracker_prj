const noteService     = require('../services/noteService');
const { sendSuccess } = require('../utils/response');

async function addNote(req, res, next) {
  try {
    const note = await noteService.addNote(
      Number(req.params.id),
      req.user.id,
      req.body.content
    );
    return sendSuccess(res, { note }, 'Note added', 201);
  } catch (err) {
    return next(err);
  }
}

async function deleteNote(req, res, next) {
  try {
    await noteService.deleteNote(Number(req.params.id), req.user.id);
    return sendSuccess(res, null, 'Note deleted');
  } catch (err) {
    return next(err);
  }
}

module.exports = { addNote, deleteNote };
