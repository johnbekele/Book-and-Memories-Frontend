// Components/AuthSuccess.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import styled from 'styled-components';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Redirect to appropriate dashboard based on user role
        if (user.role?.Admin >= 3001) {
          navigate('/admin-dashboard');
        } else if (user.role?.Moderator >= 4001) {
          navigate('/moderator-dashboard');
        } else if (user.role?.User >= 2001) {
          navigate('/user-dashboard');
        } else {
          navigate('/');
        }
      } else {
        // If no user after loading, redirect to login
        navigate('/login');
      }
    }
  }, [user, loading, navigate]);

  return (
    <SuccessContainer>
      <h2>Authentication Successful</h2>
      <p>Redirecting to your dashboard...</p>
      <Spinner />
    </SuccessContainer>
  );
};

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #1f1f1f;
  color: #f1f1f1;

  h2 {
    margin-bottom: 10px;
  }

  p {
    margin-bottom: 20px;
  }
`;

const Spinner = styled.div`
  width: 30px;
  height: 30px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  border-top-color: #2d79f3;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default AuthSuccess;
