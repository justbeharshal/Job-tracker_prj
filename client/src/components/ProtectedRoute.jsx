import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps protected pages.
 * While the auth state is loading (verifying token on mount), shows nothing.
 * If not authenticated, redirects to /login.
 */
export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <span className="material-symbols-outlined text-primary-container text-5xl animate-spin">
          progress_activity
        </span>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
