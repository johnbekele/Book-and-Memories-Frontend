import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../Context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    // The token handling is already done in AuthProvider's useEffect
    // So we just need to redirect based on user role once it's loaded
    if (user && !loading) {
      // Determine which dashboard to redirect to
      if (user.role) {
        if (user.role.Admin && user.role.Admin >= 4001) {
          navigate('/user-dashboard', { replace: true });
        } else if (user.role.Moderator && user.role.Moderator >= 3001) {
          navigate('/user-dashboard', { replace: true });
        } else if (user.role.User && user.role.User >= 2001) {
          navigate('/user-dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        // Default redirect if no role is found
        navigate('/user-dashboard', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="auth-success-container">
      <h2>Authentication Successful</h2>
      <p>Redirecting you to your dashboard...</p>
      <LoadingSpinner />
    </div>
  );
};

export default AuthSuccess;
