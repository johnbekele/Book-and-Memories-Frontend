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
  const { darkMode } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      name: 'Home',
      path: '/',
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
      path: '/reading-lists',
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
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        <button
          onClick={toggleMobileMenu}
          className={`p-3 rounded-full shadow-lg ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}
        >
          {mobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex flex-col ${
          darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        } h-screen w-64 fixed left-0 top-0 border-r ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        } transition-colors duration-200 shadow-lg`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center">
            <BookOpenIcon className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold">BookMeMo</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = active ? item.activeIcon : item.icon;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  active
                    ? darkMode
                      ? 'bg-gray-800 text-white'
                      : 'bg-blue-50 text-blue-600'
                    : darkMode
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon
                  className={`h-6 w-6 ${
                    active
                      ? 'text-blue-600'
                      : darkMode
                      ? 'text-gray-300'
                      : 'text-gray-500'
                  }`}
                />
                <span className="ml-3">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Create New Post Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            to="/create-post"
            className={`flex items-center justify-center w-full px-4 py-2 text-sm font-medium rounded-lg ${
              darkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } transition-colors duration-200`}
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            <span>Add Book Review</span>
          </Link>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            to="/profile"
            className="flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors duration-200"
          >
            <img
              src="https://via.placeholder.com/40"
              alt="User Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
            />
            <div>
              <p className="font-medium text-sm">Jane Bookworm</p>
              <p
                className={`text-xs ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                @janebooks
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 ${
          darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        } border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        } md:hidden transition-colors duration-200`}
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
                  className={`h-6 w-6 ${
                    active
                      ? 'text-blue-600'
                      : darkMode
                      ? 'text-gray-300'
                      : 'text-gray-500'
                  }`}
                />
                <span
                  className={`text-xs mt-1 ${active ? 'text-blue-600' : ''}`}
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
          className={`fixed inset-0 z-40 md:hidden ${
            darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
          } flex flex-col transition-all duration-300 ease-in-out`}
        >
          <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <BookOpenIcon className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold">BookMeMo</span>
            </Link>
            <button onClick={toggleMobileMenu}>
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
                  className={`flex items-center px-4 py-3 text-base font-medium rounded-lg transition-all ${
                    active
                      ? darkMode
                        ? 'bg-gray-800 text-white'
                        : 'bg-blue-50 text-blue-600'
                      : darkMode
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 ${
                      active
                        ? 'text-blue-600'
                        : darkMode
                        ? 'text-gray-300'
                        : 'text-gray-500'
                    }`}
                  />
                  <span className="ml-3">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Create New Post Button in Mobile Menu */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/create-post"
              onClick={toggleMobileMenu}
              className={`flex items-center justify-center w-full px-4 py-3 text-base font-medium rounded-lg ${
                darkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } transition-colors duration-200`}
            >
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              <span>Add Book Review</span>
            </Link>
          </div>

          {/* User Profile Section in Mobile Menu */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/profile"
              onClick={toggleMobileMenu}
              className="flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors duration-200"
            >
              <img
                src="https://via.placeholder.com/40"
                alt="User Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
              />
              <div>
                <p className="font-medium">Jane Bookworm</p>
                <p
                  className={`text-xs ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
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
