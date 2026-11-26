const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00',
});

/**
 * Test the DB connection on startup and log the result.
 * Does not throw — the app will crash later if queries fail.
 */
async function connectDB() {
  try {
    const conn = await pool.getConnection();
    console.log(`✅ MySQL connected — host: ${process.env.DB_HOST}, db: ${process.env.DB_NAME}`);
    conn.release();
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1);
  }
}

module.exports = { pool, connectDB };
