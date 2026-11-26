const { pool } = require('../config/db');

// ── Sort map ──────────────────────────────────────────────────────────────────
const SORT_MAP = {
  updated_at_desc: 'a.updated_at DESC',
  applied_on_desc: 'a.applied_on DESC',
  applied_on_asc:  'a.applied_on ASC',
  company_asc:     'c.name ASC',
};

/**
 * List applications for a user with optional filtering, search, pagination.
 *
 * @param {number} userId
 * @param {{ status?, q?, page, limit, sort }} filters
 * @returns {{ applications: object[], pagination: object }}
 */
async function list(userId, { status, q, page, limit, sort }) {
  const offset = (page - 1) * limit;
  const orderBy = SORT_MAP[sort] || 'a.updated_at DESC';

  // Build dynamic WHERE clauses
  const conditions = ['a.user_id = ?'];
  const params     = [userId];

  if (status) {
    conditions.push('a.status = ?');
    params.push(status);
  }

  if (q) {
    conditions.push('(c.name LIKE ? OR a.role LIKE ?)');
    const like = `%${q}%`;
    params.push(like, like);
  }

  const where = conditions.join(' AND ');

  // Count total (for pagination metadata)
  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM applications a
     JOIN companies c ON a.company_id = c.id
     WHERE ${where}`,
    params
  );
  const total = countRows[0].total;

  // Fetch page
  const [applications] = await pool.query(
    `SELECT a.id, a.role, a.location, a.status, a.salary, a.job_url,
            a.applied_on, a.follow_up_on, a.created_at, a.updated_at,
            c.id AS company_id, c.name AS company
     FROM applications a
     JOIN companies c ON a.company_id = c.id
     WHERE ${where}
     ORDER BY ${orderBy}
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return {
    applications,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get a single application with its notes and status history.
 *
 * @param {number} appId
 * @param {number} userId
 * @returns {{ application: object, notes: object[], statusHistory: object[] }}
 */
async function getById(appId, userId) {
  const [rows] = await pool.query(
    `SELECT a.id, a.role, a.location, a.status, a.salary, a.job_url,
            a.applied_on, a.follow_up_on, a.created_at, a.updated_at,
            c.id AS company_id, c.name AS company
     FROM applications a
     JOIN companies c ON a.company_id = c.id
     WHERE a.id = ? AND a.user_id = ?`,
    [appId, userId]
  );

  if (rows.length === 0) {
    const err = new Error('Application not found');
    err.statusCode = 404;
    throw err;
  }

  const [notes] = await pool.query(
    'SELECT id, content, created_at FROM notes WHERE application_id = ? ORDER BY created_at DESC',
    [appId]
  );

  const [statusHistory] = await pool.query(
    'SELECT id, from_status, to_status, changed_at FROM status_history WHERE application_id = ? ORDER BY changed_at DESC',
    [appId]
  );

  return { application: rows[0], notes, statusHistory };
}

/**
 * Create a new application.
 * Silently creates the company row if it doesn't exist for this user.
 *
 * @param {number} userId
 * @param {object} body
 * @returns {object} created application
 */
async function create(userId, body) {
  const { company, role, location, jobUrl, salary, status, appliedOn, followUpOn } = body;

  const companyId = await _lookupOrCreateCompany(userId, company);

  const [result] = await pool.query(
    `INSERT INTO applications
       (user_id, company_id, role, location, status, salary, job_url, applied_on, follow_up_on)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      companyId,
      role,
      location   || null,
      status     || 'WISHLIST',
      salary     || null,
      jobUrl     || null,
      appliedOn  || null,
      followUpOn || null,
    ]
  );

  // Write initial status_history row
  await pool.query(
    'INSERT INTO status_history (application_id, from_status, to_status) VALUES (?, NULL, ?)',
    [result.insertId, status || 'WISHLIST']
  );

  return getById(result.insertId, userId).then(({ application }) => application);
}

/**
 * Update an application's fields.
 *
 * @param {number} appId
 * @param {number} userId
 * @param {object} body
 * @returns {object} updated application
 */
async function update(appId, userId, body) {
  // Confirm ownership
  await _assertOwnership(appId, userId);

  const { company, role, location, jobUrl, salary, status, appliedOn, followUpOn } = body;

  const companyId = await _lookupOrCreateCompany(userId, company);

  await pool.query(
    `UPDATE applications
     SET company_id = ?, role = ?, location = ?, status = ?,
         salary = ?, job_url = ?, applied_on = ?, follow_up_on = ?
     WHERE id = ? AND user_id = ?`,
    [
      companyId,
      role,
      location   || null,
      status     || 'WISHLIST',
      salary     || null,
      jobUrl     || null,
      appliedOn  || null,
      followUpOn || null,
      appId,
      userId,
    ]
  );

  return getById(appId, userId).then(({ application }) => application);
}

/**
 * Change just the status and record it in status_history.
 *
 * @param {number} appId
 * @param {number} userId
 * @param {string} newStatus
 * @returns {object} updated application
 */
async function updateStatus(appId, userId, newStatus) {
  // Confirm ownership and get current status
  const [rows] = await pool.query(
    'SELECT status FROM applications WHERE id = ? AND user_id = ?',
    [appId, userId]
  );

  if (rows.length === 0) {
    const err = new Error('Application not found');
    err.statusCode = 404;
    throw err;
  }

  const fromStatus = rows[0].status;

  if (fromStatus === newStatus) {
    // No change — return as-is
    return getById(appId, userId).then(({ application }) => application);
  }

  await pool.query(
    'UPDATE applications SET status = ? WHERE id = ? AND user_id = ?',
    [newStatus, appId, userId]
  );

  // Always record the transition
  await pool.query(
    'INSERT INTO status_history (application_id, from_status, to_status) VALUES (?, ?, ?)',
    [appId, fromStatus, newStatus]
  );

  return getById(appId, userId).then(({ application }) => application);
}

/**
 * Delete an application (cascades to notes and status_history).
 *
 * @param {number} appId
 * @param {number} userId
 */
async function remove(appId, userId) {
  await _assertOwnership(appId, userId);

  await pool.query(
    'DELETE FROM applications WHERE id = ? AND user_id = ?',
    [appId, userId]
  );
}

// ── Private helpers ───────────────────────────────────────────────────────────

/**
 * Find an existing company for this user by name, or create it.
 * Returns the company id.
 */
async function _lookupOrCreateCompany(userId, companyName) {
  const [existing] = await pool.query(
    'SELECT id FROM companies WHERE user_id = ? AND name = ?',
    [userId, companyName]
  );

  if (existing.length > 0) {
    return existing[0].id;
  }

  const [result] = await pool.query(
    'INSERT INTO companies (user_id, name) VALUES (?, ?)',
    [userId, companyName]
  );

  return result.insertId;
}

/**
 * Confirm the application exists and belongs to the user.
 * Throws 404 if not found, 403 if wrong owner.
 * (In practice the WHERE user_id=? handles both — but explicit is clearer.)
 */
async function _assertOwnership(appId, userId) {
  const [rows] = await pool.query(
    'SELECT user_id FROM applications WHERE id = ?',
    [appId]
  );

  if (rows.length === 0) {
    const err = new Error('Application not found');
    err.statusCode = 404;
    throw err;
  }

  if (rows[0].user_id !== userId) {
    const err = new Error('You do not have permission to modify this application');
    err.statusCode = 403;
    throw err;
  }
}

module.exports = { list, getById, create, update, updateStatus, remove };
