import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate              = useNavigate();
  const { saveSession }       = useAuth();

  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { token, user } = await login(form);
      saveSession(token, user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="w-full min-h-screen bg-surface font-dm text-on-surface">
      <div className="w-full max-w-6xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* ── Left column: form ───────────────────────────────── */}
          <div className="lg:col-span-6 flex flex-col items-start">

            {/* Title + underline squiggle */}
            <div className="relative inline-block mb-3">
              <h1 className="font-space font-bold text-[48px] leading-[52px] tracking-[-0.03em] text-on-surface">
                Job Application Tracker
              </h1>
              <svg
                className="w-full h-4 mt-1 text-secondary-container"
                fill="none"
                viewBox="0 0 320 16"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M3 11.5C35 4.5 68 13.5 102 7.5C136 1.5 170 12.5 204 6.5C238 0.5 275 11.5 317 5.5"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4.5"
                />
              </svg>
            </div>

            <p className="font-space font-bold text-[24px] leading-[28px] tracking-[-0.02em] text-on-surface-variant mb-8">
              Welcome back
            </p>

            {/* Error banner */}
            {error && (
              <div className="w-full max-w-md mb-4 px-4 py-3 bg-error-container text-on-error-container font-dm text-sm rounded-2xl border-2 border-on-surface shadow-brutal-sm">
                <span className="material-symbols-outlined text-base align-middle mr-1">error</span>
                {error}
              </div>
            )}

            <form
              className="w-full max-w-md flex flex-col gap-5"
              onSubmit={handleSubmit}
              noValidate
            >
              {/* Email */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="font-dm font-bold text-sm tracking-[0.01em] text-on-surface"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="alex@example.com"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  className="input-brutal"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="font-dm font-bold text-sm tracking-[0.01em] text-on-surface"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  className="input-brutal"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary mt-2"
              >
                {loading ? 'Logging in…' : 'Login'}
              </button>

              {/* Switch to register */}
              <div className="mt-2 flex items-center justify-center">
                <Link
                  to="/register"
                  className="font-dm font-bold text-sm tracking-[0.01em] text-on-surface underline decoration-2 underline-offset-4 hover:text-primary-container transition-colors"
                >
                  Create an account
                </Link>
              </div>
            </form>
          </div>

          {/* ── Right column: decorative Kanban illustration ────── */}
          <div className="lg:col-span-6 relative flex items-center justify-center py-8 lg:py-12">
            <div className="relative w-full max-w-md h-[420px] flex flex-col justify-center items-center">

              {/* Star top-left */}
              <svg className="absolute top-2 left-4 w-10 h-10 text-tertiary-fixed -rotate-12" fill="none" viewBox="0 0 40 40" aria-hidden="true">
                <path d="M20 3L24.5 14.5L37 16L27.5 24.5L30 37L20 30.5L10 37L12.5 24.5L3 16L15.5 14.5L20 3Z" fill="currentColor" stroke="#111111" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
              {/* Sparkle top-right */}
              <svg className="absolute top-8 right-6 w-8 h-8 text-secondary-container rotate-12" fill="none" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M16 2L18.5 13.5L30 16L18.5 18.5L16 30L13.5 18.5L2 16L13.5 13.5L16 2Z" fill="currentColor" stroke="#111111" strokeLinejoin="round" strokeWidth="2" />
              </svg>

              {/* Card 1: Wishlist */}
              <div className="relative z-10 w-72 bg-primary-fixed-dim p-5 rounded-2xl border-2 border-on-surface shadow-brutal -rotate-3 -translate-x-6 -translate-y-4 hover:rotate-0 transition-transform duration-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-dm font-bold text-[11px] leading-[14px] tracking-[0.03em] uppercase bg-surface-container-lowest text-on-surface px-2.5 py-1 rounded-full border-2 border-on-surface">
                    Wishlist
                  </span>
                  <span className="material-symbols-outlined text-on-surface">bookmark</span>
                </div>
                <p className="font-space font-bold text-[20px] leading-[24px] tracking-[-0.015em] text-on-surface">Figma</p>
                <p className="font-dm text-sm text-on-surface-variant mt-0.5">Product Designer</p>
              </div>

              {/* Arrow 1 */}
              <svg className="relative z-20 w-12 h-12 text-on-surface -my-3 translate-x-20 rotate-6" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M10 8C24 10 34 20 34 36M34 36L26 29M34 36L41 28" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>

              {/* Card 2: Applied */}
              <div className="relative z-20 w-72 bg-primary-fixed p-5 rounded-2xl border-2 border-on-surface shadow-brutal rotate-2 translate-x-8 hover:rotate-0 transition-transform duration-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-dm font-bold text-[11px] leading-[14px] tracking-[0.03em] uppercase bg-surface-container-lowest text-on-surface px-2.5 py-1 rounded-full border-2 border-on-surface">
                    Applied
                  </span>
                  <span className="material-symbols-outlined text-on-surface">send</span>
                </div>
                <p className="font-space font-bold text-[20px] leading-[24px] tracking-[-0.015em] text-on-surface">Linear</p>
                <p className="font-dm text-sm text-on-surface-variant mt-0.5">Frontend Engineer</p>
              </div>

              {/* Arrow 2 */}
              <svg className="relative z-20 w-12 h-12 text-on-surface -my-3 -translate-x-16 -rotate-12" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M36 8C22 12 14 22 14 38M14 38L8 30M14 38L22 31" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>

              {/* Card 3: Offer */}
              <div className="relative z-30 w-72 bg-tertiary-fixed p-5 rounded-2xl border-2 border-on-surface shadow-brutal -rotate-2 -translate-x-4 translate-y-2 hover:rotate-0 transition-transform duration-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-dm font-bold text-[11px] leading-[14px] tracking-[0.03em] uppercase bg-surface-container-lowest text-on-surface px-2.5 py-1 rounded-full border-2 border-on-surface">
                    Offer
                  </span>
                  <span className="material-symbols-outlined text-on-surface" style={{ fontVariationSettings: "'FILL' 1" }}>celebration</span>
                </div>
                <p className="font-space font-bold text-[20px] leading-[24px] tracking-[-0.015em] text-on-surface">Vercel</p>
                <p className="font-dm text-sm text-on-surface-variant mt-0.5">Design Engineer</p>
              </div>

              {/* Star bottom-right */}
              <svg className="absolute bottom-4 right-4 w-9 h-9 text-primary-container rotate-12" fill="none" viewBox="0 0 40 40" aria-hidden="true">
                <path d="M20 3L24.5 14.5L37 16L27.5 24.5L30 37L20 30.5L10 37L12.5 24.5L3 16L15.5 14.5L20 3Z" fill="currentColor" stroke="#111111" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
