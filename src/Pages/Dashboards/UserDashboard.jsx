import React, { Suspense, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import UserNavBar from '../../Components/UserNavBar';
import BookSidebar from '../../Components/BookSidebar';
import { useTheme } from '../../Context/ThemeContext';
import { useLogger } from '../../Hook/useLogger.js';
import NotificationModal from '../../Components/NotificationModal';
import { useNotification } from '../../Hook/useNotification.js';
import { useUser } from '../../Hook/useUser.js';
import { useState } from 'react';
import { saveCurrentPath, restoreLastPath } from '../../utils/sessionHelper';
import AddBookPage from '../UserPages/AddBookPage.jsx';

function UserDashboard() {
  const logger = useLogger();
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useTheme();
  const [isNotificationModalOpen, setNotificationModalOpen] = useState(false);
  const [isaddBookPageOpen, setaddBookPageOpen] = useState(false);
  const { notifications, isLoading, isError } = useNotification();
  const { user, isLoading: userLoading, isError: userError } = useUser();

  // Save current path to session storage & restore on reload
  useEffect(() => {
    // Try to restore the last path from session storage
    if (location.pathname === '/' || location.pathname === '/user-dashboard') {
      restoreLastPath(navigate);
    }

    // Set up the beforeunload event listener to save the current path
    return saveCurrentPath();
  }, [navigate, location.pathname]);

  // Determine active view based on current path
  const getActiveView = () => {
    const path = location.pathname;
    if (path.includes('/books/add')) return 'addBook';
    if (path.includes('/profile')) return 'profile';
    if (path.includes('/library')) return 'myLibrary';
    if (path.includes('/chat')) return 'chat';
    return 'home';
  };

  const activeView = getActiveView();

  const handleaddBookPage = () => {
    setaddBookPageOpen(!isaddBookPageOpen);
  };

  const handleNotificationModal = () => {
    setNotificationModalOpen(!isNotificationModalOpen);
  };

  const handleMyLibraryPage = () => {
    navigate('/user-dashboard/library');
    logger.log('My Library Page initialized');
  };

  const resetToHome = () => {
    // First clear the lastPath from session storage to prevent auto-redirect
    sessionStorage.removeItem('lastPath');
    // Then navigate to dashboard index
    navigate('/user-dashboard');
    logger.log('Reset to home view');
  };

  const handleProfileModal = () => {
    navigate('/user-dashboard/profile');
    logger.log('Profile Modal initialized');
  };

  const handleChatPage = () => {
    navigate('/user-dashboard/chat');
    logger.log('Chat Page initialized');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-base-300' : 'bg-base-100'}`}>
      <UserNavBar
        fromwhere="user"
        onNotification={handleNotificationModal}
        onProfile={handleProfileModal}
        activeView={activeView}
        onHome={resetToHome}
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
              onNotification={handleNotificationModal}
              onMyLibrary={handleMyLibraryPage}
              onHome={resetToHome}
              onChat={handleChatPage}
              activeView={activeView}
              onAddBook={handleaddBookPage}
            />
          )}

          {isaddBookPageOpen && <AddBookPage onClose={handleaddBookPage} />}

          <main
            className={`flex-1 p-4 md:ml-64 ${
              darkMode ? 'text-gray-200' : 'text-gray-800'
            }`}
          >
            <Suspense fallback={<div>Loading...</div>}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
