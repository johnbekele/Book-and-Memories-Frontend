import React from 'react';
import UserNavBar from '../../Components/UserNavBar';
import FeedPage from '../UserPages/FeedPage';

function UserDashboard() {
  return (
    <div>
      <UserNavBar />
      <FeedPage />
    </div>
  );
}

export default UserDashboard;
