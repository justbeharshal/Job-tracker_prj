import api from './axios';

/**
 * Register a new account.
 * @param {{ name: string, email: string, password: string }} data
 * @returns {{ token: string, user: object }}
 */
export async function register(data) {
  const res = await api.post('/auth/register', data);
  return res.data.data; // { token, user }
}

/**
 * Login with email + password.
 * @param {{ email: string, password: string }} data
 * @returns {{ token: string, user: object }}
 */
export async function login(data) {
  const res = await api.post('/auth/login', data);
  return res.data.data; // { token, user }
}

/**
 * Fetch the currently authenticated user.
 * @returns {{ user: object }}
 */
export async function getMe() {
  const res = await api.get('/auth/me');
  return res.data.data; // { user }
}
