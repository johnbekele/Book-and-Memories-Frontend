import React from 'react';
import UserNavBar from '../../Components/UserNavBar';
import FeedPage from '../UserPages/FeedPage';
import BookSidebar from '../../Components/BookSidebar';
function UserDashboard() {
  return (
    <div>
      <UserNavBar />
      <BookSidebar />
      <FeedPage />
    </div>
  );
}

export default UserDashboard;
