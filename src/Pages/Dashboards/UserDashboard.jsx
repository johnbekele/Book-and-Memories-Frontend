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
import Chat from '../../Components/Chat.jsx';

const AddBookPage = lazy(() => import('../UserPages/AddBookPage'));

function UserDashboard() {
  const logger = useLogger();
  const { darkMode } = useTheme();
  const [activeView, setActiveView] = useState('home'); // 'home', 'addBook', 'profile', 'myLibrary'
  const [isNotificationModalOpen, setNotificationModalOpen] = useState(false);
  const { notifications, isLoading, isError } = useNotification();
  const { user, isLoading: userLoading, isError: userError } = useUser();

  const handleaddBookPage = () => {
    logger.log('Add Book Page initialized');
    setActiveView(activeView === 'addBook' ? 'home' : 'addBook');
  };

  const handleNotificationModal = () => {
    setNotificationModalOpen(!isNotificationModalOpen);
  };

  const handleMyLibraryPage = () => {
    setActiveView(activeView === 'myLibrary' ? 'home' : 'myLibrary');
  };

  const resetToHome = () => {
    setActiveView('home');
    logger.log('Reset to home view');
  };

  const handleProfileModal = () => {
    logger.log('Profile Modal initialized');
    setActiveView(activeView === 'profile' ? 'home' : 'profile');
  };

  // Render the active component based on state
  const renderActiveView = () => {
    switch (activeView) {
      case 'addBook':
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <AddBookPage openaddpage={handleaddBookPage} />
          </Suspense>
        );
      case 'profile':
        return <ProfilePage />;
      case 'myLibrary':
        return <MyLibrary />;
      case 'home':
      default:
        return <Chat />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-base-300' : 'bg-base-100'}`}>
      <UserNavBar
        fromwhere="user"
        onNotification={handleNotificationModal}
        onProfile={handleProfileModal}
        activeView={activeView}
      />
      {/* Add padding-top to account for fixed navbar */}
      <div className="pt-16">
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
              activeView={activeView}
            />
          )}

          <main
            className={`flex-1 p-4 ${
              darkMode ? 'text-gray-200' : 'text-gray-800'
            }`}
          >
            {renderActiveView()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
