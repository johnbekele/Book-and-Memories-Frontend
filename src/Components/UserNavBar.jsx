import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../Context/AuthContext';
import { useLogger } from '../Hook/useLogger';
import { useTheme } from '../Context/ThemeContext';

const UserNavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const logger = useLogger();
  const { darkMode, toggleTheme } = useTheme();

  logger.log('My user', user);

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
            {/* Theme Toggle Button - Added at the top */}
            <li className="mb-2">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-between py-2 transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{darkMode ? '🌙' : '☀️'}</span>
                  <span>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
                </div>
                <div
                  className={`w-10 h-5 rounded-full relative ${
                    darkMode ? 'bg-primary' : 'bg-gray-300'
                  } transition-colors duration-300`}
                >
                  <div
                    className={`absolute w-4 h-4 rounded-full bg-white top-0.5 transition-transform duration-300 ${
                      darkMode ? 'translate-x-5 left-0.5' : 'left-0.5'
                    }`}
                  ></div>
                </div>
              </button>
            </li>

            {/* Divider line */}
            <li className="border-b border-gray-200 dark:border-gray-700 my-1"></li>

            <li>
              <Link className="justify-between" to="">
                Profile
                <span className="badge">New</span>
              </Link>
            </li>
            {user.role && user.role.Admin && user.role.Admin >= 4001 && (
              <li>
                <Link to="/admin-dashboard" className="justify-between">
                  Admin panel
                  <span className="badge">New</span>
                </Link>
              </li>
            )}
            {user.role &&
              user.role.Moderator &&
              user.role.Moderator >= 3001 && (
                <li>
                  <Link to="/moderator-dashboard" className="justify-between">
                    Moderator panel
                    <span className="badge">New</span>
                  </Link>
                </li>
              )}

            <li>
              <Link to="">Settings</Link>
            </li>
            <li>
              <Link onClick={logout} to="/">
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserNavBar;
