import { Navigate } from 'react';
import { Navigate as RouterNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

/**
 * Wraps private routes. Redirects to /login if user is not authenticated.
 * If `adminOnly` is set to true, redirects non-admin users to /dashboard.
 * Shows spinner while auth state is loading.
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid var(--color-border)', borderTopColor: 'var(--color-accent)', borderRadius: '50%' }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <RouterNavigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <RouterNavigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
