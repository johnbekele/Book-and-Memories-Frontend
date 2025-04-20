import { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../Context/AuthContext';
import LoadingSpinner from '../Components/LoadingSpinner';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ FIXED
  const { user, loading } = useContext(AuthContext);

  const redirectTo = location.state?.redirectTo || '/user-dashboard';

  useEffect(() => {
    if (user && !loading) {
      if (user.role) {
        if (user.role.Admin >= 4001 && redirectTo === '/admin-dashboard') {
          navigate('/admin-dashboard', { replace: true });
        } else if (
          user.role.Moderator >= 3001 &&
          redirectTo === '/moderator-dashboard'
        ) {
          navigate('/moderator-dashboard', { replace: true });
        } else if (user.role.User >= 2001 && redirectTo === '/user-dashboard') {
          navigate('/user-dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        navigate('/user-dashboard', { replace: true });
      }
    }
  }, [user, loading, navigate, redirectTo]);

  return (
    <div className="auth-success-container">
      <h2>Authentication Successful</h2>
      <p>Redirecting you to your dashboard...</p>
      <LoadingSpinner />
    </div>
  );
};

export default AuthSuccess;
