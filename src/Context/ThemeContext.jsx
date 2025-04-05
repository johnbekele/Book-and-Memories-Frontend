// ThemeContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the context
const ThemeContext = createContext();

// Custom hook for using the theme
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Check for user's system preference or saved preference
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Toggle theme function
  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  // Update localStorage and apply theme when darkMode changes
  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    document.documentElement.setAttribute(
      'data-theme',
      darkMode ? 'dark' : 'light'
    );
  }, [darkMode]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (localStorage.getItem('theme') === null) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
