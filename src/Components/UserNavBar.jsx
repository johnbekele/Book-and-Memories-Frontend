import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../Context/AuthContext';
import { useLogger } from '../Hook/useLogger';
import { useTheme } from '../Context/ThemeContext';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import {
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/24/outline';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const UserNavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const logger = useLogger();
  const { theme, toggleTheme, colors } = useTheme();
  const isDark = theme === 'dark';

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <StyledNavbar colors={colors} isDark={isDark}>
      <div className="navbar-container">
        {/* Logo at the left edge */}
        <div className="logo-section">
          <Link to="/" className="logo-link">
            <BookOpenIcon className="logo-icon" />
            <span className="logo-text">BookMeMo</span>
          </Link>
        </div>

        {/* Empty space in the middle */}
        <div className="spacer"></div>

        {/* Welcome text and profile at the right edge */}
        <div className="user-wrapper">
          <div className="welcome-section">
            <p className="welcome-text">
              Welcome <span className="user-name">{user.firstname}</span>!
            </p>
          </div>

          <div className="user-section" ref={dropdownRef}>
            <motion.button
              className="avatar-button"
              onClick={toggleDropdown}
              aria-expanded={dropdownOpen}
              aria-label="User menu"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="avatar-ring">
                <div className="avatar">
                  <img alt="User avatar" src={user.photo} />
                </div>
              </div>
            </motion.button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  className="dropdown-menu"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Theme Toggle Button */}
                  <motion.div
                    className="menu-item theme-toggle"
                    whileHover={{
                      backgroundColor: isDark
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(0,0,0,0.05)',
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTheme();
                      }}
                      className="theme-button"
                    >
                      <div className="theme-label">
                        {isDark ? (
                          <MoonIcon className="theme-icon" />
                        ) : (
                          <SunIcon className="theme-icon" />
                        )}
                        <span>{isDark ? 'Dark' : 'Light'}</span>
                      </div>
                      <motion.div
                        className={`toggle-track ${isDark ? 'active' : ''}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className={`toggle-thumb ${isDark ? 'active' : ''}`}
                          layout
                          transition={{
                            type: 'spring',
                            stiffness: 700,
                            damping: 30,
                          }}
                        ></motion.div>
                      </motion.div>
                    </button>
                  </motion.div>

                  <div className="menu-divider"></div>

                  {/* Menu items */}
                  <motion.div
                    whileHover={{
                      backgroundColor: isDark
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(0,0,0,0.05)',
                    }}
                  >
                    <Link className="menu-item" to="" onClick={closeDropdown}>
                      <div className="menu-item-content">
                        <UserCircleIcon className="menu-icon" />
                        <span>Profile</span>
                      </div>
                      <span className="badge">New</span>
                    </Link>
                  </motion.div>

                  <motion.div
                    whileHover={{
                      backgroundColor: isDark
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(0,0,0,0.05)',
                    }}
                  >
                    <Link className="menu-item" to="" onClick={closeDropdown}>
                      <div className="menu-item-content">
                        <Cog6ToothIcon className="menu-icon" />
                        <span>Settings</span>
                      </div>
                      <span className="badge">New</span>
                    </Link>
                  </motion.div>

                  {user.role.Admin && user.role.Admin >= 4001 && (
                    <motion.div
                      whileHover={{
                        backgroundColor: isDark
                          ? 'rgba(255,255,255,0.05)'
                          : 'rgba(0,0,0,0.05)',
                      }}
                    >
                      <Link className="menu-item" to="" onClick={closeDropdown}>
                        <div className="menu-item-content">
                          <ShieldCheckIcon className="menu-icon" />
                          <span>Admin</span>
                        </div>
                      </Link>
                    </motion.div>
                  )}

                  {user.role.Moderator && user.role.Moderator >= 3001 && (
                    <motion.div
                      whileHover={{
                        backgroundColor: isDark
                          ? 'rgba(255,255,255,0.05)'
                          : 'rgba(0,0,0,0.05)',
                      }}
                    >
                      <Link className="menu-item" to="" onClick={closeDropdown}>
                        <div className="menu-item-content">
                          <ShieldCheckIcon className="menu-icon" />
                          <span>Moderator</span>
                        </div>
                      </Link>
                    </motion.div>
                  )}

                  <div className="menu-divider"></div>

                  <motion.div
                    whileHover={{
                      backgroundColor: isDark
                        ? 'rgba(220,38,38,0.2)'
                        : 'rgba(254,226,226,1)',
                    }}
                  >
                    <Link
                      className="menu-item logout"
                      to="/"
                      onClick={(e) => {
                        logout();
                        closeDropdown();
                      }}
                    >
                      <div className="menu-item-content">
                        <ArrowRightOnRectangleIcon className="menu-icon" />
                        <span>Logout</span>
                      </div>
                    </Link>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </StyledNavbar>
  );
};

// Styled component for the navbar
const StyledNavbar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background-color: ${(props) => props.colors.backgroundColor};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: background-color 0.3s ease, color 0.3s ease;
  backdrop-filter: blur(10px);

  .navbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1.25rem;
    width: 100%;
  }

  .logo-section {
    display: flex;
    align-items: center;
  }

  .logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
  }

  .logo-icon {
    height: 2rem;
    width: 2rem;
    color: ${(props) => props.colors.textColor};
  }

  .logo-text {
    margin-left: 0.5rem;
    font-size: 1.25rem;
    font-weight: 700;
    color: ${(props) => props.colors.textColor};
  }

  .spacer {
    flex-grow: 1;
  }

  .user-wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .welcome-section {
    display: flex;
    align-items: center;
  }

  .welcome-text {
    color: ${(props) => props.colors.textColor};
    font-size: 0.95rem;
    margin: 0;
    white-space: nowrap;
  }

  .user-name {
    font-weight: 600;
    color: ${(props) => props.colors.buttonText};
  }

  .user-section {
    position: relative;
  }

  .avatar-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;
  }

  .avatar-ring {
    padding: 2px;
    border-radius: 50%;
    background: ${(props) =>
      `linear-gradient(45deg, ${props.colors.buttonText}, ${props.colors.buttonBackground})`};
  }

  .avatar {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid ${(props) => props.colors.backgroundColor};
    transition: border-color 0.3s ease;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .dropdown-menu {
    position: absolute;
    right: 0;
    top: calc(100% + 0.75rem);
    width: 13rem; /* 52 units in tailwind */
    background-color: ${(props) => (props.isDark ? '#1f1f1f' : '#ffffff')};
    border-radius: 0.75rem;
    box-shadow: ${(props) =>
      props.isDark
        ? '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
        : '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'};
    overflow: hidden;
    z-index: 100;
    border: 1px solid ${(props) => (props.isDark ? '#333' : '#e5e7eb')};
  }

  .menu-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem 0.75rem;
    color: ${(props) => props.colors.textColor};
    text-decoration: none;
    transition: background-color 0.2s ease;
    cursor: pointer;
    font-size: 0.875rem;
  }

  .menu-item-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .menu-icon {
    width: 1.1rem;
    height: 1.1rem;
    color: ${(props) => (props.isDark ? '#a0a0a0' : '#6b7280')};
  }

  .theme-toggle {
    padding: 0;
  }

  .theme-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    background: none;
    border: none;
    padding: 0.6rem 0.75rem;
    cursor: pointer;
    color: ${(props) => props.colors.textColor};
  }

  .theme-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .theme-icon {
    width: 1.1rem;
    height: 1.1rem;
    color: ${(props) => (props.isDark ? '#a0a0a0' : '#6b7280')};
  }

  .toggle-track {
    width: 2.25rem;
    height: 1.25rem;
    background-color: ${(props) =>
      props.isDark ? 'rgba(255,255,255,0.2)' : '#d1d5db'};
    border-radius: 9999px;
    position: relative;
    transition: background-color 0.3s ease;
    padding: 0.125rem;

    &.active {
      background-color: ${(props) => props.colors.buttonText};
    }
  }

  .toggle-thumb {
    position: absolute;
    width: 1rem;
    height: 1rem;
    background-color: white;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);

    &.active {
      transform: translateX(1rem);
    }
  }

  .menu-divider {
    height: 1px;
    background-color: ${(props) => (props.isDark ? '#333' : '#e5e7eb')};
    margin: 0.25rem 0;
  }

  .badge {
    background-color: ${(props) => props.colors.buttonBackground};
    color: ${(props) => props.colors.btntextcolor};
    font-size: 0.65rem;
    padding: 0.15rem 0.4rem;
    border-radius: 9999px;
    font-weight: 600;
    letter-spacing: 0.025em;
  }

  .logout {
    color: ${(props) => (props.isDark ? '#f87171' : '#dc2626')};
  }

  @media (max-width: 640px) {
    .welcome-section {
      display: none;
    }

    .logo-text {
      font-size: 1.1rem;
    }

    .dropdown-menu {
      width: 12rem;
      right: -0.5rem;
    }
  }
`;

export default UserNavBar;
