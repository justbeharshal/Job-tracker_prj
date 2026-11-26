const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { pool } = require('../config/db');

const SALT_ROUNDS = 12;

/**
 * Register a new user.
 * @param {{ name: string, email: string, password: string }} data
 * @returns {{ token: string, user: object }}
 */
async function register({ name, email, password }) {
  // Check for duplicate email
  const [existing] = await pool.query(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );
  if (existing.length > 0) {
    const err = new Error('An account with this email already exists');
    err.statusCode = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const [result] = await pool.query(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, passwordHash]
  );

  const user = { id: result.insertId, name, email };
  const token = signToken(user);
  return { token, user };
}

/**
 * Login with email + password.
 * @param {{ email: string, password: string }} data
 * @returns {{ token: string, user: object }}
 */
async function login({ email, password }) {
  const [rows] = await pool.query(
    'SELECT id, name, email, password_hash FROM users WHERE email = ?',
    [email]
  );

  if (rows.length === 0) {
    // Use a generic message to avoid email enumeration
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const dbUser = rows[0];
  const passwordMatch = await bcrypt.compare(password, dbUser.password_hash);

  if (!passwordMatch) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const user = { id: dbUser.id, name: dbUser.name, email: dbUser.email };
  const token = signToken(user);
  return { token, user };
}

/**
 * Return current authenticated user by id.
 * @param {number} userId
 * @returns {object} user
 */
async function getMe(userId) {
  const [rows] = await pool.query(
    'SELECT id, name, email, created_at FROM users WHERE id = ?',
    [userId]
  );

  if (rows.length === 0) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  return rows[0];
}

// ── Private helper ────────────────────────────────────────────────────────────

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

module.exports = { register, login, getMe };
