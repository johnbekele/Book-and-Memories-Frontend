import React, { lazy, Suspense } from 'react';
import { useFlagged } from '../../Hook/useFlagged';
import FlaggedUserPage from '../ModeratorePages/FlaggedUserPage';

//React.lazy load
const UserNavbar = React.lazy(() => import('../../Components/UserNavBar'));

function ModeratorDashboard() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <UserNavbar fromwhere="moderator" />
        <FlaggedUserPage />
      </Suspense>
    </div>
  );
}

export default ModeratorDashboard;
