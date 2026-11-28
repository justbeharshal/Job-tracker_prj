import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate              = useNavigate();
  const { saveSession }       = useAuth();

  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { token, user } = await register(form);
      setSuccess(true);
      // Brief flash of success state before navigating
      setTimeout(() => {
        saveSession(token, user);
        navigate('/dashboard', { replace: true });
      }, 900);
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">

          {/* ── Left column: form ───────────────────────────────── */}
          <div className="lg:col-span-6 flex flex-col items-start w-full max-w-md mx-auto lg:mx-0">

            {/* Title + underline squiggle */}
            <div className="relative mb-8">
              <h1 className="font-space font-bold text-[48px] leading-[52px] tracking-[-0.03em] text-on-surface">
                Job Application Tracker
              </h1>
              <svg
                className="w-64 h-4 mt-1 text-secondary-container"
                fill="none"
                viewBox="0 0 260 16"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M3 11.5C28 3.5 52 14.5 78 6.5C104 -1.5 130 13.5 156 6.5C182 -0.5 208 13.5 234 5.5C243 2.5 251 6.5 257 9.5"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                />
              </svg>
            </div>

            {/* Error banner */}
            {error && (
              <div className="w-full mb-4 px-4 py-3 bg-error-container text-on-error-container font-dm text-sm rounded-2xl border-2 border-on-surface shadow-brutal-sm">
                <span className="material-symbols-outlined text-base align-middle mr-1">error</span>
                {error}
              </div>
            )}

            <form
              className="w-full flex flex-col gap-5"
              onSubmit={handleSubmit}
              noValidate
            >
              {/* Name */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="font-dm font-bold text-sm tracking-[0.01em] text-on-surface uppercase"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Alex Rivera"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  className="input-brutal"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="font-dm font-bold text-sm tracking-[0.01em] text-on-surface uppercase"
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
                  className="font-dm font-bold text-sm tracking-[0.01em] text-on-surface uppercase"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  className="input-brutal"
                />
                <p className="font-dm text-xs text-on-surface-variant">Minimum 8 characters</p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || success}
                className={`btn-primary mt-2 ${
                  success
                    ? '!bg-tertiary-fixed-dim !text-on-surface !shadow-brutal-sm'
                    : ''
                }`}
              >
                {success ? '✓ Account Created!' : loading ? 'Creating account…' : 'Register'}
              </button>
            </form>

            <p className="mt-6 font-dm text-base text-on-surface-variant">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-dm font-bold text-sm tracking-[0.01em] text-primary underline decoration-2 underline-offset-4 hover:text-primary-container transition-colors"
              >
                Login
              </Link>
            </p>
          </div>

          {/* ── Right column: decorative Kanban illustration ────── */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[440px] w-full">

            {/* Stars */}
            <svg className="absolute top-4 left-8 w-8 h-8 text-tertiary-fixed-dim -rotate-12" fill="currentColor" stroke="#111111" strokeWidth="2" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M16 2L19.8 11.4L30 12.2L22.2 18.8L24.6 28.8L16 23.4L7.4 28.8L9.8 18.8L2 12.2L12.2 11.4L16 2Z" />
            </svg>
            <svg className="absolute bottom-8 right-10 w-10 h-10 text-secondary-container rotate-12" fill="currentColor" stroke="#111111" strokeWidth="2" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M16 2L19.8 11.4L30 12.2L22.2 18.8L24.6 28.8L16 23.4L7.4 28.8L9.8 18.8L2 12.2L12.2 11.4L16 2Z" />
            </svg>
            <svg className="absolute top-16 right-6 w-6 h-6 text-primary-fixed-dim rotate-45" fill="currentColor" stroke="#111111" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
            </svg>

            {/* Kanban card stack */}
            <div className="relative w-full max-w-sm h-[380px] flex items-center justify-center">

              {/* Card 1: Wishlist */}
              <div className="absolute top-2 left-2 w-64 p-5 bg-primary-fixed-dim border-2 border-on-surface rounded-2xl shadow-brutal -rotate-3 hover:rotate-0 transition-transform duration-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-dm font-bold text-[11px] leading-[14px] tracking-[0.03em] uppercase px-2.5 py-0.5 bg-surface-container-lowest text-on-surface border-2 border-on-surface rounded-full">
                    Wishlist
                  </span>
                  <span className="material-symbols-outlined text-on-surface text-xl">bookmark</span>
                </div>
                <p className="font-space font-bold text-[20px] leading-[24px] tracking-[-0.015em] text-on-surface">Spotify</p>
                <p className="font-dm text-sm text-on-surface-variant mt-0.5">Product Designer</p>
              </div>

              {/* Card 2: Interview */}
              <div className="absolute top-28 right-0 w-64 p-5 bg-tertiary-fixed border-2 border-on-surface rounded-2xl shadow-brutal rotate-2 hover:rotate-0 transition-transform duration-200 z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-dm font-bold text-[11px] leading-[14px] tracking-[0.03em] uppercase px-2.5 py-0.5 bg-surface-container-lowest text-on-surface border-2 border-on-surface rounded-full">
                    Interview
                  </span>
                  <span className="material-symbols-outlined text-on-surface text-xl">event</span>
                </div>
                <p className="font-space font-bold text-[20px] leading-[24px] tracking-[-0.015em] text-on-surface">Figma</p>
                <p className="font-dm text-sm text-on-surface-variant mt-0.5">Design Engineer</p>
              </div>

              {/* Card 3: Offer */}
              <div className="absolute bottom-2 left-6 w-64 p-5 bg-tertiary-fixed-dim border-2 border-on-surface rounded-2xl shadow-brutal -rotate-2 hover:rotate-0 transition-transform duration-200 z-20">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-dm font-bold text-[11px] leading-[14px] tracking-[0.03em] uppercase px-2.5 py-0.5 bg-surface-container-lowest text-on-surface border-2 border-on-surface rounded-full">
                    Offer
                  </span>
                  <span className="material-symbols-outlined text-on-surface text-xl">celebration</span>
                </div>
                <p className="font-space font-bold text-[20px] leading-[24px] tracking-[-0.015em] text-on-surface">Linear</p>
                <p className="font-dm text-sm text-on-surface-variant mt-0.5">Frontend Developer</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
