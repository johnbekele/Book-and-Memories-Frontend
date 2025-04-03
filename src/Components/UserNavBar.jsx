import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../Context/AuthContext';
import { useLogger } from '../Hook/useLogger';

const UserNavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const logger = useLogger();

  logger.log('My user', user);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfile = () => {
    logger.log('user role ', user.role);
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a href="#" className="btn btn-ghost text-xl">
          Book-MeMo
        </a>
      </div>
      <div className="mr-2.5">
        <p>
          Welcome {user.firstname}! {''}{' '}
        </p>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img alt="Tailwind CSS Navbar component" src={user.photo} />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between" onClick={handleProfile}>
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            {user.role && user.role.Admin && user.role.Admin >= 4001 && (
              <li>
                <a
                  className="justify-between"
                  onClick={navigateToAdminDashboard}
                >
                  Admin panel
                  <span className="badge">New</span>
                </a>
              </li>
            )}
            {user.role &&
              user.role.Moderator &&
              user.role.Moderator >= 3001 && (
                <li>
                  <Link
                    to="/moderator-dashboard"
                    className="justify-between"
                    // onClick={() => navigate('/moderator-dashboard')}
                  >
                    Moderator panel
                    <span className="badge">New</span>
                  </Link>
                </li>
              )}

            <li>
              <a onClick={() => navigate('/settings')}>Settings</a>
            </li>
            <li>
              <a onClick={handleLogout}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserNavBar;
