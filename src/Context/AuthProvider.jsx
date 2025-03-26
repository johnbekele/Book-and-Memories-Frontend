import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async (token) => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data);
        } else {
          logout();
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        logout();
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    }
  }, [logout]);

  //Login requeste
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        navigate(getDashboardRoute(data.user.role));
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  //Logout request
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  //route Dashboard according to roles
  const getDashboardRoute = (role) => {
    switch (true) {
      case role.User >= 2001:
        return '/admin-dashboard';
      case role.Moderator >= 3001:
        return '/moderatore-dashboard';
      case role.Admin >= 4001:
        return '/user-dashboard';
      default:
        return '/';
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
