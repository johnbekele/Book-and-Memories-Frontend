import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import UserNavBar from '../../Components/UserNavBar';
import FeedPage from '../UserPages/FeedPage';
import BookSidebar from '../../Components/BookSidebar';
import { useTheme } from '../../Context/ThemeContext';

function UserDashboard() {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-base-300' : 'bg-base-100'}`}>
      <UserNavBar />
      {/* Add padding-top to account for fixed navbar */}
      <div className="pt-16">
        {' '}
        {/* Adjust this value based on your navbar height */}
        <div className="flex flex-col md:flex-row">
          <BookSidebar />
          <main
            className={`flex-1 p-4 ${
              darkMode ? 'text-gray-200' : 'text-gray-800'
            }`}
          >
            <FeedPage />
          </main>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
