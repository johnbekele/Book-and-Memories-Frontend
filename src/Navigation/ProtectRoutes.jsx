import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../Components/LoadingSpinner';
import AuthContext from '../Context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, initialized } = useContext(AuthContext);

  // Wait for auth initialization to complete
  if (loading || !initialized) {
    console.log('Auth is still loading or initializing...');
    return <LoadingSpinner />;
  }

  // Handle unauthenticated state
  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('User authenticated:', user);
  console.log('Required role:', requiredRole);
  console.log('User roles:', user.role);

  // Check if user has the required role
  const hasRequiredRole = () => {
    if (!user.role) return false;

    switch (requiredRole) {
      case 'Admin':
        return user.role.Admin >= 4001;
      case 'Moderator':
        return user.role.Moderator >= 3001;
      case 'User':
        return user.role.User >= 2001;
      default:
        return false;
    }
  };

  if (!hasRequiredRole()) {
    // Redirect based on highest role
    if (user.role?.Admin >= 4001) {
      return <Navigate to="/admin-dashboard" replace />;
    } else if (user.role?.Moderator >= 3001) {
      return <Navigate to="/moderator-dashboard" replace />;
    } else if (user.role?.User >= 2001) {
      return <Navigate to="/user-dashboard" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
