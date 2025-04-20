import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../Components/LoadingSpinner';
import AuthContext from '../Context/AuthContext';
import { useLogger } from '../Hook/useLogger';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, initialized } = useContext(AuthContext);
  const location = useLocation();
  const logger = useLogger();

  const rolePriority = {
    Admin: 3,
    Moderator: 2,
    User: 1,
  };

  const allowedRoleValues = {
    Admin: 4001,
    Moderator: 3001,
    User: 2001,
  };

  if (loading || !initialized) {
    logger.log('Auth is still loading or initializing...');
    return <LoadingSpinner />;
  }

  if (!user || !user.role) {
    logger.log('No user or role found, redirecting to login');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Extract valid roles the user has
  const userRoles = Object.entries(user.role).filter(([_, value]) =>
    Object.values(allowedRoleValues).includes(value)
  );

  // Sort by priority (descending)
  userRoles.sort(([a], [b]) => rolePriority[b] - rolePriority[a]);

  const roleKey = userRoles[0]?.[0]; // Highest role name
  let hasAccess = false;

  console.log('role key:', roleKey);

  // Role-based access control
  if (roleKey === 'Admin') {
    hasAccess = true;
    logger.log('User is an Admin - granting access');
  } else if (roleKey === 'Moderator') {
    if (['Moderator', 'User'].includes(requiredRole)) {
      hasAccess = true;
      logger.log('User is a Moderator - granting access');
    }
  } else if (roleKey === 'User') {
    if (requiredRole === 'User') {
      hasAccess = true;
      logger.log('User is a regular User - granting access');
    }
  }

  if (!hasAccess) {
    logger.log(`Access denied for ${requiredRole} page`);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="mb-4">You don't have permission to access this page.</p>
          <p className="mb-4">Your current role: {roleKey ?? 'Unknown'}</p>
          <p className="mb-4">Required role: {requiredRole}</p>
          <div className="flex space-x-4">
            {roleKey === 'Admin' && (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => (window.location.href = '/admin-dashboard')}
              >
                Go to Admin Dashboard
              </button>
            )}
            {roleKey === 'Moderator' && (
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => (window.location.href = '/moderator-dashboard')}
              >
                Go to Moderator Dashboard
              </button>
            )}
            {roleKey === 'User' && (
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
