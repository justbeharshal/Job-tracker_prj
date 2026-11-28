import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, clearSession } = useAuth();
  const navigate = useNavigate();

  function logout() {
    clearSession();
    navigate('/login', { replace: true });
  }

  return (
    <main className="w-full min-h-screen bg-surface flex flex-col items-center justify-center gap-6">
      <div className="bg-surface-container-lowest border-2 border-on-surface rounded-2xl shadow-brutal p-10 text-center max-w-sm w-full mx-6">
        <span className="material-symbols-outlined text-5xl text-primary-container mb-4 block">
          check_circle
        </span>
        <h1 className="font-space font-bold text-[24px] leading-[28px] tracking-[-0.02em] text-on-surface mb-2">
          You're in, {user?.name}! 🎉
        </h1>
        <p className="font-dm text-sm text-on-surface-variant mb-6">
          Dashboard coming soon. Auth is working end-to-end.
        </p>
        <button onClick={logout} className="btn-primary">
          Logout
        </button>
      </div>
    </main>
  );
}
