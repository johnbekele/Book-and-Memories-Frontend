import React, { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../Components/LoadingSpinner';
import AuthContext from '../Context/AuthContext';
import { useLogger } from '../Hook/useLogger';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, initialized } = useContext(AuthContext);
  const location = useLocation();
  const logger = useLogger();

  // Store the role requirements and minimum values
  const allowedRoleValues = {
    Admin: 4001,
    Moderator: 3001,
    User: 2001,
  };

  // During render, update selected role if on a dashboard page
  useEffect(() => {
    // If we're on a dashboard, update the selected role
    if (user && !loading) {
      const dashboardMatch = location.pathname.match(/\/(\w+)-dashboard/);
      if (dashboardMatch) {
        const currentDashboard = dashboardMatch[1];
        const capitalizedRole =
          currentDashboard.charAt(0).toUpperCase() + currentDashboard.slice(1);

        // Check if this role is valid for the user
        if (
          user.role &&
          user.role[capitalizedRole] >= allowedRoleValues[capitalizedRole]
        ) {
          localStorage.setItem('selectedRole', capitalizedRole);
        }
      }
    }
  }, [location.pathname, user, loading]);

  if (loading || !initialized) {
    logger.log('Auth is still loading or initializing...');
    return <LoadingSpinner />;
  }

  if (!user || !user.role) {
    logger.log('No user or role found, redirecting to login');
    localStorage.setItem('intendedPath', location.pathname);
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Check access based on allowedRoles (array of lowercase role names)
  let hasAccess = false;

  // Convert allowedRoles to properly capitalized format for checking
  const capitalizedAllowedRoles = allowedRoles.map(
    (role) => role.charAt(0).toUpperCase() + role.slice(1)
  );

  // Admin has access to everything
  if (user.role.Admin >= allowedRoleValues.Admin) {
    hasAccess = true;
    logger.log('User is an Admin - granting access');
  }
  // Moderator has access to Moderator and User pages
  else if (
    user.role.Moderator >= allowedRoleValues.Moderator &&
    (capitalizedAllowedRoles.includes('Moderator') ||
      capitalizedAllowedRoles.includes('User'))
  ) {
    hasAccess = true;
    logger.log('User is a Moderator - granting access');
  }
  // User has access only to User pages
  else if (
    user.role.User >= allowedRoleValues.User &&
    capitalizedAllowedRoles.includes('User')
  ) {
    hasAccess = true;
    logger.log('User is a regular User - granting access');
  }

  if (!hasAccess) {
    logger.log(`Access denied for ${allowedRoles.join(', ')} page`);

    // Get the selected role or default to highest available
    const selectedRole = localStorage.getItem('selectedRole');
    let highestRole = 'User';

    if (user.role.Admin >= allowedRoleValues.Admin) {
      highestRole = 'Admin';
    } else if (user.role.Moderator >= allowedRoleValues.Moderator) {
      highestRole = 'Moderator';
    }

    const redirectRole = selectedRole || highestRole;
    const redirectPath = `/${redirectRole.toLowerCase()}-dashboard`;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="mb-4">You don't have permission to access this page.</p>
          <p className="mb-4">
            Your current role: {selectedRole || highestRole}
          </p>
          <p className="mb-4">Required role: {allowedRoles.join(', ')}</p>
          <div className="flex space-x-4">
            {user.role.Admin >= allowedRoleValues.Admin && (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => {
                  localStorage.setItem('selectedRole', 'Admin');
                  window.location.href = '/admin-dashboard';
                }}
              >
                Go to Admin Dashboard
              </button>
            )}
            {user.role.Moderator >= allowedRoleValues.Moderator && (
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => {
                  localStorage.setItem('selectedRole', 'Moderator');
                  window.location.href = '/moderator-dashboard';
                }}
              >
                Go to Moderator Dashboard
              </button>
            )}
            {user.role.User >= allowedRoleValues.User && (
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                onClick={() => {
                  localStorage.setItem('selectedRole', 'User');
                  window.location.href = '/user-dashboard';
                }}
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
