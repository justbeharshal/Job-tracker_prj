const { pool } = require('../config/db');

/**
 * Returns full stats for the authenticated user:
 * - countsByStatus: { WISHLIST: n, APPLIED: n, ... }
 * - total: total application count
 * - recentActivity: last 10 status changes across all their applications
 * - upcomingFollowUps: applications with follow_up_on in the next 7 days
 *
 * @param {number} userId
 * @returns {object}
 */
async function getStats(userId) {
  // 1. Counts per status (run in parallel with others)
  const [countRows, recentRows, followUpRows] = await Promise.all([
    pool.query(
      `SELECT status, COUNT(*) AS count
       FROM applications
       WHERE user_id = ?
       GROUP BY status`,
      [userId]
    ),
    pool.query(
      `SELECT sh.id, sh.from_status, sh.to_status, sh.changed_at,
              a.id AS application_id, a.role,
              c.name AS company
       FROM status_history sh
       JOIN applications a ON sh.application_id = a.id
       JOIN companies    c ON a.company_id = c.id
       WHERE a.user_id = ?
       ORDER BY sh.changed_at DESC
       LIMIT 10`,
      [userId]
    ),
    pool.query(
      `SELECT a.id, a.role, a.follow_up_on, a.status,
              c.name AS company
       FROM applications a
       JOIN companies c ON a.company_id = c.id
       WHERE a.user_id = ?
         AND a.follow_up_on BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
       ORDER BY a.follow_up_on ASC`,
      [userId]
    ),
  ]);

  // Build countsByStatus — ensure all 5 stages are present, default 0
  const ALL_STATUSES = ['WISHLIST', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'];
  const countsByStatus = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = 0;
    return acc;
  }, {});

  for (const row of countRows[0]) {
    countsByStatus[row.status] = Number(row.count);
  }

  const total = Object.values(countsByStatus).reduce((sum, n) => sum + n, 0);

  return {
    countsByStatus,
    total,
    recentActivity:    recentRows[0],
    upcomingFollowUps: followUpRows[0],
  };
}

module.exports = { getStats };
