import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';
import { API_URL } from '../Config/EnvConfig';

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();

  // Define logout function first to avoid circular dependency
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  // Function to fetch user data
  const fetchUser = useCallback(
    async (token) => {
      try {
        setLoading(true);

        // Debug token
        console.log('Token being used:', token);
        console.log('Token type:', typeof token);
        console.log('Token length:', token ? token.length : 0);

        if (!token) {
          console.error('No valid token available');
          setLoading(false);
          return false;
        }

        const authHeader = `Bearer ${token}`;
        console.log('Authorization header:', authHeader);

        // Make the actual fetch request
        const response = await fetch(`${API_URL}/api/auth/profile`, {
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json',
          },
        });

        // Handle response
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server response:', response.status, errorText);
          throw new Error(`Failed to fetch user profile: ${response.status}`);
        }

        const data = await response.json();
        console.log('User data fetched:', data);

        // Update user state
        setUser(data);
        setLoading(false);
        return true;
      } catch (error) {
        console.error('Error fetching user:', error);

        if (error.message.includes('401') || error.message.includes('403')) {
          console.log('Authentication error detected, logging out');
          logout();
        } else {
          setLoading(false);
        }
        return false;
      }
    },
    [logout]
  );

  // Check for Google OAuth redirect
  useEffect(() => {
    const checkForGoogleRedirect = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (token) {
        console.log('OAuth token received from URL');
        // Clear URL parameters
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
        if (window.location.pathname === '/auth-success') {
          window.history.replaceState(
            {},
            document.title,
            './Components/AuthSuccess'
          );
        }
        localStorage.setItem('token', token);
        await fetchUser(token);
      }

      //  If no token from OAuth, check localStorage
      if (!token) {
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
  }, [fetchUser]);

  // Login function
  const login = async (loginData) => {
    try {
      setLoading(true);
      console.log('Attempting login with:', loginData);

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
        credentials: 'include',
      });

      const data = await response.json();
      console.log('Login response status:', response.status);
      console.log('Complete login response:', data);

      if (response.ok) {
        const token = data.accessToken || data.token || data.jwt;
        console.log('Token extracted from response:', token);

        if (!token) {
          console.error('No token received in login response');
          throw new Error('No token received');
        }

        // Store token with explicit string conversion
        localStorage.setItem('token', String(token));
        console.log('Token stored in localStorage:', token);

        // Immediately verify storage worked
        const storedToken = localStorage.getItem('token');
        console.log('Stored token verification:', storedToken ? 'Yes' : 'No');
        console.log(
          'Stored token length:',
          storedToken ? storedToken.length : 0
        );
        console.log(
          'First 20 chars of stored token:',
          storedToken ? storedToken.substring(0, 20) : 'NONE'
        );

        // Compare with original
        console.log('Tokens match:', token === storedToken);

        setUser(data.user);
        console.log('User logged in:', data.user);
        console.log('Dashboard role:', data.user.role);

        // Redirect to dashboard
        navigate(getDashboardRoute(data.user.role));
        setLoading(false);
        return true;
      } else {
        console.error('Login response error:', data);
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setLoading(false);
      return false;
    }
  };

  // Google login request
  const googleLogin = () => {
    setLoading(true);
    console.log('Initiating Google login');
    window.location.href = `${API_URL}/api/auth/google`;
  };

  // Route Dashboard according to roles
  const getDashboardRoute = (role) => {
    if (!role) return '/';

    if (role.Admin && role.Admin >= 4001) {
      return '/admin-dashboard';
    } else if (role.Moderator && role.Moderator >= 3001) {
      return '/moderator-dashboard';
    } else if (role.User && role.User >= 2001) {
      return '/user-dashboard';
    } else {
      return '/';
    }
  };

  const contextValue = {
    user,
    loading,
    initialized,
    login,
    logout,
    googleLogin,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
