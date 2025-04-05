import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../Context/AuthContext';
import { useLogger } from '../Hook/useLogger';
import { useTheme } from '../Context/ThemeContext';
import { BookOpenIcon } from '@heroicons/react/24/outline';

const UserNavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const logger = useLogger();

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="navbar shadow-md fixed top-0 left-0 right-0 z-50 theme-navbar">
      <div className="sticky top-0 z-10 p-4 flex-1 theme-navbar">
        <Link to="/" className="flex items-center">
          <BookOpenIcon className="h-8 w-8 theme-icon" />
          <span className="ml-2 text-xl font-bold theme-text">BookMeMo</span>
        </Link>
      </div>

      <div className="mr-2.5">
        <p className="theme-text">
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
              <img alt="User avatar" src={user.photo} />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content rounded-box z-[100] mt-3 w-52 p-2 shadow theme-dropdown"
          >
            {/* Theme Toggle Button */}
            <li className="mb-2">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-between py-2 transition-all duration-300"
              >
                <div className="flex items-center gap-2 theme-text">
                  <span className="text-lg">{isDark ? '🌙' : '☀️'}</span>
                  <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
                </div>
                <div
                  className={`w-10 h-5 rounded-full relative ${
                    isDark ? 'bg-primary' : 'bg-gray-300'
                  } transition-colors duration-300`}
                >
                  <div
                    className={`absolute w-4 h-4 rounded-full bg-white top-0.5 transition-transform duration-300 ${
                      isDark ? 'translate-x-5 left-0.5' : 'left-0.5'
                    }`}
                  ></div>
                </div>
              </button>
            </li>

            {/* Menu items with theme classes */}
            <li>
              <Link className="justify-between theme-text" to="">
                Profile
                <span className="badge theme-button">New</span>
              </Link>
            </li>

            {/* Rest of your menu items with theme-text class */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserNavBar;
