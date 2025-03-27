// Navigation/ProtectRoutes.jsx
import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../Components/LoadingSpinner';
import AuthContext from '../Context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useContext(AuthContext);

  // Add debugging on component mount
  useEffect(() => {
    console.log('ProtectedRoute mounted');
    console.log('Current auth state:', { user, loading });
    console.log('Token in localStorage:', localStorage.getItem('token'));

    // Check if localStorage is working properly
    const testKey = 'test_' + Date.now();
    try {
      localStorage.setItem(testKey, 'test');
      const testValue = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      console.log(
        'localStorage test:',
        testValue === 'test' ? 'PASSED' : 'FAILED'
      );
    } catch (error) {
      console.error('localStorage test error:', error);
    }
  }, [user, loading]);

  // Show detailed loading state
  if (loading) {
    console.log('Auth is still loading...');
    return <LoadingSpinner />;
  }

  // Handle unauthenticated state
  if (!user) {
    console.log('No user found, redirecting to login');
    console.log(
      'Current token in localStorage:',
      localStorage.getItem('token')
    );
    return <Navigate to="/login" replace />;
  }

  console.log('User authenticated:', user);
  console.log('Required role:', requiredRole);
  console.log('User roles:', user.role);

  // Check if user has the required role with the correct numeric value
  const hasRequiredRole = () => {
    if (!user.role) {
      console.log('User has no roles');
      return false;
    }

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

  const userHasRole = hasRequiredRole();
  console.log('User has required role:', userHasRole);

  if (!userHasRole) {
    console.log(
      'User lacks required role, redirecting to appropriate dashboard'
    );

    // Redirect to the appropriate dashboard based on highest role
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

  console.log('Rendering protected content');
  return children;
};

export default ProtectedRoute;
