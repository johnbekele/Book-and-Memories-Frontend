import React, { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../Components/LoadingSpinner';
import AuthContext from '../Context/AuthContext';
import { useLogger } from '../Hook/useLogger';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, initialized } = useContext(AuthContext);
  const location = useLocation();
  const logger = useLogger();

  useEffect(() => {
    logger.log('ProtectedRoute rendered for path:', location.pathname);
    logger.log('Required role:', requiredRole);
    logger.log('Current user:', user);
    logger.log('User roles:', user?.role);
  }, [location.pathname, requiredRole, user]);

  // Wait for auth initialization to complete
  if (loading || !initialized) {
    logger.log('Auth is still loading or initializing...');
    return <LoadingSpinner />;
  }

  // Handle unauthenticated state
  if (!user) {
    logger.log('No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Debug logging
  logger.log(`Checking if user has role: ${requiredRole}`);
  logger.log(`User has Admin role: ${user.role?.Admin === 4001}`);
  logger.log(`User has Moderator role: ${user.role?.Moderator === 3001}`);
  logger.log(`User has User role: ${user.role?.User === 2001}`);

  // Simplified role check with proper hierarchy - adjusted for your actual role levels
  let hasAccess = false;

  if (user.role?.Admin === 4001) {
    // Admin can access everything
    logger.log('User is an Admin - granting access');
    hasAccess = true;
  } else if (user.role?.Moderator === 3001) {
    // Moderator can access Moderator and User pages
    if (requiredRole === 'Moderator' || requiredRole === 'User') {
      logger.log('User is a Moderator - granting access');
      hasAccess = true;
    }
  } else if (user.role?.User === 2001) {
    // User can only access User pages
    if (requiredRole === 'User') {
      logger.log('User is a regular User - granting access');
      hasAccess = true;
    }
  }

  if (!hasAccess) {
    logger.log(`Access denied for ${requiredRole} page`);

    // Access denied component with correct role level checks
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="mb-4">You don't have permission to access this page.</p>
          <p className="mb-4">
            Your current role:{' '}
            {user.role?.Admin === 4001
              ? 'Admin'
              : user.role?.Moderator === 3001
              ? 'Moderator'
              : user.role?.User === 2001
              ? 'User'
              : 'Unknown'}
          </p>
          <p className="mb-4">Required role: {requiredRole}</p>
          <div className="flex space-x-4">
            {user.role?.Admin === 4001 && (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => (window.location.href = '/admin-dashboard')}
              >
                Go to Admin Dashboard
              </button>
            )}
            {user.role?.Moderator === 3001 && (
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => (window.location.href = '/moderator-dashboard')}
              >
                Go to Moderator Dashboard
              </button>
            )}
            {user.role?.User === 2001 && (
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                onClick={() => (window.location.href = '/user-dashboard')}
              >
                Go to User Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  logger.log('Access granted - rendering protected content');
  return children;
};

export default ProtectedRoute;
