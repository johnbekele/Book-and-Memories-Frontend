import React, { useState, lazy, Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';
import UserNavBar from '../../Components/UserNavBar';
import FeedPage from '../UserPages/FeedPage';
import BookSidebar from '../../Components/BookSidebar';
import { useTheme } from '../../Context/ThemeContext';
import { useLogger } from '../../Hook/useLogger.js';
import NotificationModal from '../../Components/NotificationModal';
import { useNotification } from '../../Hook/useNotification.js';
import ProfilePage from '../../Components/ProfilePage.jsx';
import { useUser } from '../../Hook/useUser.js';
import MyLibrary from '../../Components/MyLibrary.jsx';

const AddBookPage = lazy(() => import('../UserPages/AddBookPage'));

function UserDashboard() {
  const logger = useLogger();
  const { darkMode } = useTheme();
  const [addBookPage, setAddBookPage] = useState(false);
  const [isNotificationModalOpen, setNotificationModalOpen] = useState(false);
  const { notifications, isLoading, isError } = useNotification();
  const [isProfieleModalOpen, setProfileModalOpen] = useState(false);
  const { user, isLoading: userLoading, isError: userError } = useUser();
  const [ismylibrarypage, setMyLibraryPage] = useState(false);
  const [isHome, setIsHomePage] = useState(true);

  const handleaddBookPage = () => {
    logger.log('Add Book Page initialized');
    setAddBookPage(!addBookPage);
    setIsHomePage(!isHome);
  };

  const handleNotificationModal = () => {
    setNotificationModalOpen(!isNotificationModalOpen);
  };

  const handleMyLibraryPage = () => {
    setMyLibraryPage(!ismylibrarypage);
    setIsHomePage(!isHome);
  };
  const resetToHome = () => {
    setIsHomePage(true);
  };

  const handleUpdateUser = (updatedUserData) => {
    console.log('Updating user data:', updatedUserData);
    // Implement the logic to update the user data
    // This might involve calling an API or updating context state
  };

  const handleProfileModal = () => {
    console.log('Profile Modal initialized');
    setIsHomePage(!isHome);
  };
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-base-300' : 'bg-base-100'}`}>
      <UserNavBar
        fromwhere="user"
        onNotification={handleNotificationModal}
        onProfile={handleProfileModal}
      />
      {/* Add padding-top to account for fixed navbar */}
      <div className="pt-16">
        {' '}
        {/* Adjust this value based on your navbar height */}
        <div className="flex flex-col md:flex-row">
          {isNotificationModalOpen ? (
            <NotificationModal
              notifications={notifications}
              isError={isError}
              isLoading={isLoading}
              onClose={handleNotificationModal}
            />
          ) : (
            <BookSidebar
              openaddpage={handleaddBookPage}
              onNotification={handleNotificationModal}
              onMyLibrary={handleMyLibraryPage}
              onHome={resetToHome}
            />
          )}

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
            {isProfieleModalOpen && <ProfilePage />}{' '}
            {ismylibrarypage && <MyLibrary />}
            {isHome && <FeedPage />}
          </main>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
