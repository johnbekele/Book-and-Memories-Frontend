// 1. First, let's fix the AuthProvider.jsx

// In AuthProvider.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';
import { API_URL } from '../Config/EnvConfig';
import { useLogger } from '../Hook/useLogger';
import { getTokenExpirationTime } from '../Config/jwtUtils.js';

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();
  const logger = useLogger();

  // Add a state to store the intended dashboard
  const [intendedDashboard, setIntendedDashboard] = useState(null);

  const logout = useCallback(() => {
    setLoading(true);
    logger.log('Logging out user');
    localStorage.removeItem('token');
    localStorage.removeItem('selectedRole'); // Clear role selection on logout
    localStorage.removeItem('lastVisitedPath'); // Clear last path on logout
    setUser(null);
    setLoading(false);
    navigate('/login');
  }, [navigate]);

  // Function to fetch user data
  const fetchUser = useCallback(
    async (token) => {
      try {
        setLoading(true);
        const timeleft = await getTokenExpirationTime(token);
        console.log('time left', timeleft);

        if (!token) {
          logger.error('No valid token available');
          setLoading(false);
          return false;
        }

        const authHeader = `Bearer ${token}`;
        logger.log('Authorization header:', authHeader);

        // Make the actual fetch request
        const response = await fetch(`${API_URL}/auth/profile`, {
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json',
          },
        });

        // Handle response
        if (!response.ok) {
          const errorText = await response.text();
          logger.error('Server response:', response.status, errorText);
          throw new Error(`Failed to fetch user profile: ${response.status}`);
        }

        const data = await response.json();

        // Update user state
        setUser(data);

        // Check if we have a stored role selection
        const selectedRole = localStorage.getItem('selectedRole');

        // If we have a path to navigate to after auth
        const lastPath = localStorage.getItem('lastVisitedPath');

        if (
          selectedRole &&
          ['Admin', 'Moderator', 'User'].includes(selectedRole)
        ) {
          // If role is already selected, go directly to that dashboard
          const dashboardPath = `/${selectedRole.toLowerCase()}-dashboard`;
          navigate(dashboardPath, { replace: true });
        } else if (
          lastPath &&
          lastPath !== '/login' &&
          lastPath !== '/auth-success'
        ) {
          // If we have a last path that's not login or auth-success, go there
          navigate(lastPath, { replace: true });
        } else {
          // Otherwise, go to auth-success to choose role
          navigate('/auth-success', { replace: true });
        }

        setLoading(false);
        return true;
      } catch (error) {
        logger.error('Error fetching user:', error);

        if (error.message.includes('401') || error.message.includes('403')) {
          logger.log('Authentication error detected, logging out');
          logout();
        } else {
          setLoading(false);
        }
        return false;
      }
    },
    [logout, navigate]
  );

  // Check for Google OAuth redirect
  useEffect(() => {
    if (initialized) return;
    const checkForGoogleRedirect = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (token) {
        logger.log('OAuth token received from URL');
        // Store the token
        localStorage.setItem('token', token);
        await fetchUser(token);

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      } else {
        // If no token from OAuth, check localStorage
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          await fetchUser(storedToken);
        } else {
          setLoading(false);
        }
      }

      setInitialized(true);
    };

    checkForGoogleRedirect();
  }, [fetchUser, initialized]);

  // Function to set active role
  const setActiveRole = (role) => {
    if (['Admin', 'Moderator', 'User'].includes(role)) {
      localStorage.setItem('selectedRole', role);
      const dashboardPath = `/${role.toLowerCase()}-dashboard`;
      navigate(dashboardPath, { replace: true });
    }
  };

  // Login function
  const login = async (loginData) => {
    try {
      setLoading(true);
      alert(
        'First-time login may take 5-10 seconds due to API initialization. Thank you for your patience.'
      );

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
        credentials: 'include',
      });

      const data = await response.json();
      logger.log('Login response status:', response.status);
      logger.log('Complete login response:', data);

      if (response.ok) {
        const token = data.accessToken || data.token || data.jwt;

        if (!token) {
          logger.error('No token received in login response');
          throw new Error('No token received');
        }

        // Store token with explicit string conversion
        localStorage.setItem('token', String(token));
        logger.log('Token stored in localStorage:', token);

        // Immediately verify storage worked
        const storedToken = localStorage.getItem('token');
        logger.log('Stored token verification:', storedToken ? 'Yes' : 'No');
        logger.log(
          'Stored token length:',
          storedToken ? storedToken.length : 0
        );
        logger.log(
          'First 20 chars of stored token:',
          storedToken ? storedToken.substring(0, 20) : 'NONE'
        );

        // Compare with original
        logger.log('Tokens match:', token === storedToken);

        setUser(data.user);
        logger.log('User logged in:', data.user);
        logger.log('Dashboard role:', data.user.role);

        // Clear any previous role selection when logging in fresh
        localStorage.removeItem('selectedRole');

        // Redirect to auth-success for role selection
        navigate('/auth-success', { replace: true });
        setLoading(false);
        return true;
      } else {
        logger.error('Login response error:', data);
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      setLoading(false);
      return [false, error];
    }
  };

  // Google login request
  const googleLogin = () => {
    setLoading(true);
    alert(
      'First-time login may take 5-10 seconds due to API initialization. Thank you for your patience.'
    );
    logger.log('Initiating Google login');
    window.location.href = `${API_URL}/auth/google`;
  };

  const contextValue = {
    user,
    loading,
    initialized,
    login,
    logout,
    googleLogin,
    setActiveRole, // New function to set active role
    intendedDashboard,
    setIntendedDashboard,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
