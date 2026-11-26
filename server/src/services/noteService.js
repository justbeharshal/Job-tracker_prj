const { pool } = require('../config/db');

/**
 * Add a note to an application.
 * Verifies the application belongs to the requesting user first.
 *
 * @param {number} appId
 * @param {number} userId
 * @param {string} content
 * @returns {object} created note
 */
async function addNote(appId, userId, content) {
  // Confirm application ownership before allowing note creation
  const [app] = await pool.query(
    'SELECT id FROM applications WHERE id = ? AND user_id = ?',
    [appId, userId]
  );

  if (app.length === 0) {
    const err = new Error('Application not found');
    err.statusCode = 404;
    throw err;
  }

  const [result] = await pool.query(
    'INSERT INTO notes (application_id, content) VALUES (?, ?)',
    [appId, content]
  );

  const [rows] = await pool.query(
    'SELECT id, application_id, content, created_at FROM notes WHERE id = ?',
    [result.insertId]
  );

  return rows[0];
}

/**
 * Delete a note.
 * Verifies ownership through the notes → applications JOIN.
 *
 * @param {number} noteId
 * @param {number} userId
 */
async function deleteNote(noteId, userId) {
  // Ownership check: note must belong to an application owned by this user
  const [rows] = await pool.query(
    `SELECT n.id
     FROM notes n
     JOIN applications a ON n.application_id = a.id
     WHERE n.id = ? AND a.user_id = ?`,
    [noteId, userId]
  );

  if (rows.length === 0) {
    const err = new Error('Note not found');
    err.statusCode = 404;
    throw err;
  }

  await pool.query('DELETE FROM notes WHERE id = ?', [noteId]);
}

module.exports = { addNote, deleteNote };
