import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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

const BookSidebar = ({ openaddpage }) => {
  // Use the new theme context
  const { theme, colors, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Custom handler for post action

  const navItems = [
    {
      name: 'Home',
      path: '/user-dashboard',
      icon: HomeIcon,
      activeIcon: HomeSolid,
      isCustomAction: false,
    },
    {
      name: 'Explore',
      path: '/explore',
      icon: MagnifyingGlassIcon,
      activeIcon: MagnifyingGlassSolid,
      isCustomAction: false,
    },
    {
      name: 'Post',
      path: '/books/add',
      icon: PlusCircleIcon,
      activeIcon: BookmarkSolid,
      isCustomAction: true,
      action: openaddpage,
    },
    {
      name: 'My Library',
      path: '/library',
      icon: BookOpenIcon,
      activeIcon: BookOpenSolid,
      isCustomAction: false,
    },
    {
      name: 'Favorites',
      path: '/favorites',
      icon: HeartIcon,
      activeIcon: HeartSolid,
      isCustomAction: false,
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Render nav item based on whether it's a custom action or regular link
  const renderNavItem = (item, isMobile = false) => {
    const active = isActive(item.path);
    const Icon = active ? item.activeIcon : item.icon;

    // Common styles
    const commonStyles = {
      backgroundColor: active ? 'rgba(0, 122, 255, 0.1)' : 'transparent',
      color: active ? colors.buttonText : colors.textColor,
    };

    const iconStyles = {
      color: active ? colors.buttonText : isDark ? '#a0aec0' : '#718096',
    };

    const commonClasses = isMobile
      ? 'flex flex-col items-center justify-center'
      : 'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all';

    if (item.isCustomAction) {
      return (
        <button
          key={item.name}
          onClick={item.action}
          style={commonStyles}
          className={commonClasses}
        >
          <Icon
            style={iconStyles}
            className={isMobile ? 'h-6 w-6' : 'h-6 w-6'}
          />
          <span className={isMobile ? 'text-xs mt-1' : 'ml-3'}>
            {item.name}
          </span>
        </button>
      );
    } else {
      return (
        <Link
          key={item.name}
          to={item.path}
          style={commonStyles}
          className={commonClasses}
        >
          <Icon
            style={iconStyles}
            className={isMobile ? 'h-6 w-6' : 'h-6 w-6'}
          />
          <span className={isMobile ? 'text-xs mt-1' : 'ml-3'}>
            {item.name}
          </span>
        </Link>
      );
    }
  };

  return (
    <>
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
          {navItems.map((item) => renderNavItem(item))}
        </nav>
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
          {navItems.slice(0, 5).map((item) => renderNavItem(item, true))}
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

              if (item.isCustomAction) {
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      item.action();
                      toggleMobileMenu();
                    }}
                    style={{
                      backgroundColor: active
                        ? 'rgba(0, 122, 255, 0.1)'
                        : 'transparent',
                      color: active ? colors.buttonText : colors.textColor,
                    }}
                    className="flex items-center px-4 py-3 text-base font-medium rounded-lg transition-all w-full"
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
                  </button>
                );
              } else {
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
              }
            })}
          </nav>
        </div>
      )}
    </>
  );
};

export default BookSidebar;
