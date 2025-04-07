import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../Context/ThemeContext';

// Import icons
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BookOpenIcon,
  HeartIcon,
  UserCircleIcon,
  BookmarkIcon,
  PlusCircleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import {
  HomeIcon as HomeSolid,
  MagnifyingGlassIcon as MagnifyingGlassSolid,
  BookOpenIcon as BookOpenSolid,
  HeartIcon as HeartSolid,
  UserCircleIcon as UserCircleSolid,
  BookmarkIcon as BookmarkSolid,
} from '@heroicons/react/24/solid';

const BookSidebar = () => {
  // Use the new theme context
  const { theme, colors, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      name: 'Home',
      path: '/user-dashboard',
      icon: HomeIcon,
      activeIcon: HomeSolid,
    },
    {
      name: 'Explore',
      path: '/explore',
      icon: MagnifyingGlassIcon,
      activeIcon: MagnifyingGlassSolid,
    },
    {
      name: 'My Library',
      path: '/library',
      icon: BookOpenIcon,
      activeIcon: BookOpenSolid,
    },
    {
      name: 'Reading Lists',
      path: '/my-lists',
      icon: BookmarkIcon,
      activeIcon: BookmarkSolid,
    },
    {
      name: 'Favorites',
      path: '/favorites',
      icon: HeartIcon,
      activeIcon: HeartSolid,
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: UserCircleIcon,
      activeIcon: UserCircleSolid,
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {/* <div className="fixed bottom-4 right-4 z-50 md:hidden">
        <button
          onClick={toggleMobileMenu}
          style={{
            backgroundColor: isDark ? '#333' : '#fff',
            color: colors.textColor,
          }}
          className="p-3 rounded-full shadow-lg btn"
        >
          {mobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div> */}

      {/* Desktop Sidebar */}
      <div
        style={{
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
          color: colors.textColor,
        }}
        className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-16 border-r transition-colors duration-200 shadow-lg"
      >
        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = active ? item.activeIcon : item.icon;

            return (
              <Link
                key={item.name}
                to={item.path}
                style={{
                  backgroundColor: active
                    ? 'rgba(0, 122, 255, 0.1)'
                    : 'transparent',
                  color: active ? colors.buttonText : colors.textColor,
                }}
                className="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all"
              >
                <Icon
                  style={{
                    color: active
                      ? colors.buttonText
                      : isDark
                      ? '#a0aec0'
                      : '#718096',
                  }}
                  className="h-6 w-6"
                />
                <span className="ml-3">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle Button */}
        <div
          // style={{ borderColor: colors.borderColor }}
          className="px-4 py-2 "
        >
          <button
            onClick={toggleTheme}
            style={{
              backgroundColor: isDark ? '#333' : '#f7fafc',
              color: colors.textColor,
            }}
            className="flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
          >
            <span className="mr-2">{isDark ? '🌙' : '☀️'}</span>
            <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        </div>

        {/* Create New Post Button */}
        <div style={{ borderColor: colors.borderColor }} className="p-4 ">
          <Link
            to="/create-post"
            style={{
              backgroundColor: colors.buttonBackground,
              color: colors.btntextcolor,
            }}
            className="btn w-full flex items-center justify-center"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            <span>Add Book Review</span>
          </Link>
        </div>

        {/* User Profile Section */}
        <div style={{ borderColor: colors.borderColor }} className="p-4 ">
          <Link
            to="/profile"
            className="flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200"
            style={{
              ':hover': {
                backgroundColor: isDark ? '#333' : '#f7fafc',
              },
            }}
          >
            <img
              src="https://via.placeholder.com/40"
              alt="User Profile"
              className="w-10 h-10 rounded-full object-cover "
              style={{ borderColor: colors.buttonBackground }}
            />
            <div>
              <p
                style={{ color: colors.textColor }}
                className="font-medium text-sm"
              >
                Jane Bookworm
              </p>
              <p
                style={{ color: isDark ? '#a0aec0' : '#718096' }}
                className="text-xs"
              >
                @janebooks
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div
        style={{
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
        }}
        className="fixed bottom-0 left-0 right-0 z-40 border-t md:hidden transition-colors duration-200"
      >
        <div className="grid grid-cols-5 h-16">
          {navItems.slice(0, 5).map((item) => {
            const active = isActive(item.path);
            const Icon = active ? item.activeIcon : item.icon;

            return (
              <Link
                key={item.name}
                to={item.path}
                className="flex flex-col items-center justify-center"
              >
                <Icon
                  style={{
                    color: active
                      ? colors.buttonText
                      : isDark
                      ? '#a0aec0'
                      : '#718096',
                  }}
                  className="h-6 w-6"
                />
                <span
                  style={{
                    color: active ? colors.buttonText : colors.textColor,
                  }}
                  className="text-xs mt-1"
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Full Screen Menu */}
      {mobileMenuOpen && (
        <div
          style={{ backgroundColor: colors.backgroundColor }}
          className="fixed inset-0 z-40 md:hidden flex flex-col transition-all duration-300 ease-in-out"
        >
          {/* Logo in Mobile Menu - Also at the top */}
          <div
            style={{ borderColor: colors.borderColor }}
            className="p-5 border-b flex justify-between items-center"
          >
            <Link to="/" className="flex items-center">
              <BookOpenIcon
                style={{ color: colors.buttonText }}
                className="h-8 w-8"
              />
              <span
                style={{ color: colors.textColor }}
                className="ml-2 text-xl font-bold"
              >
                BookMeMo
              </span>
            </Link>
            <button
              onClick={toggleMobileMenu}
              style={{ color: colors.textColor }}
              className="btn btn-ghost btn-circle"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 py-4 px-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const Icon = active ? item.activeIcon : item.icon;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={toggleMobileMenu}
                  style={{
                    backgroundColor: active
                      ? 'rgba(0, 122, 255, 0.1)'
                      : 'transparent',
                    color: active ? colors.buttonText : colors.textColor,
                  }}
                  className="flex items-center px-4 py-3 text-base font-medium rounded-lg transition-all"
                >
                  <Icon
                    style={{
                      color: active
                        ? colors.buttonText
                        : isDark
                        ? '#a0aec0'
                        : '#718096',
                    }}
                    className="h-6 w-6"
                  />
                  <span className="ml-3">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Theme Toggle Button in Mobile Menu */}
          <div
            style={{ borderColor: colors.borderColor }}
            className="px-4 py-2 border-t"
          >
            <button
              onClick={toggleTheme}
              style={{
                backgroundColor: isDark ? '#333' : '#f7fafc',
                color: colors.textColor,
              }}
              className="flex items-center w-full px-4 py-2 text-base font-medium rounded-lg transition-colors duration-200"
            >
              <span className="mr-2">{isDark ? '🌙' : '☀️'}</span>
              <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>

          {/* Create New Post Button in Mobile Menu */}
          <div style={{ borderColor: colors.borderColor }} className="p-4 ">
            <Link
              to="/create-post"
              onClick={toggleMobileMenu}
              style={{
                backgroundColor: colors.buttonBackground,
                color: colors.btntextcolor,
              }}
              className="btn w-full flex items-center justify-center"
            >
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              <span>Add Book Review</span>
            </Link>
          </div>

          {/* User Profile Section in Mobile Menu */}
          <div style={{ borderColor: colors.borderColor }} className="p-4 ">
            <Link
              to="/profile"
              onClick={toggleMobileMenu}
              className="flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200"
              style={{
                ':hover': {
                  backgroundColor: isDark ? '#333' : '#f7fafc',
                },
              }}
            >
              <img
                src="https://via.placeholder.com/40"
                alt="User Profile"
                className="w-10 h-10 rounded-full object-cover "
                style={{ borderColor: colors.buttonBackground }}
              />
              <div>
                <p style={{ color: colors.textColor }} className="font-medium">
                  Jane Bookworm
                </p>
                <p
                  style={{ color: isDark ? '#a0aec0' : '#718096' }}
                  className="text-xs"
                >
                  @janebooks
                </p>
              </div>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default BookSidebar;
