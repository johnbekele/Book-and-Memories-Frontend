import React, { useState, lazy, Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';
import UserNavBar from '../../Components/UserNavBar';
import FeedPage from '../UserPages/FeedPage';
import BookSidebar from '../../Components/BookSidebar';
import { useTheme } from '../../Context/ThemeContext';

const AddBookPage = lazy(() => import('../UserPages/AddBookPage'));

function UserDashboard() {
  const { darkMode } = useTheme();
  const [addBookPage, setAddBookPage] = useState(false);

  const handleaddBookPage = () => {
    console.log('Add Book Page initialized');
    setAddBookPage(!addBookPage);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-base-300' : 'bg-base-100'}`}>
      <UserNavBar />
      {/* Add padding-top to account for fixed navbar */}
      <div className="pt-16">
        {' '}
        {/* Adjust this value based on your navbar height */}
        <div className="flex flex-col md:flex-row">
          <BookSidebar openaddpage={handleaddBookPage} />
          <main
            className={`flex-1 p-4 ${
              darkMode ? 'text-gray-200' : 'text-gray-800'
            }`}
          >
            {' '}
            {addBookPage && (
              <Suspense fallback={<div>Loading...</div>}>
                <AddBookPage openaddpage={handleaddBookPage} />
              </Suspense>
            )}
            <FeedPage />
          </main>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
