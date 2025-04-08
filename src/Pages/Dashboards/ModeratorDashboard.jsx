import React, { lazy, Suspense } from 'react';

const UserNavbar = lazy(() => import('../../Components/UserNavBar'));
import { useFlagged } from '../../Hook/useFlagged';

function ModeratorDashboard() {
  const { flagged, isLoading, isError, error } = useFlagged();

  console.log('Flagged posts:', flagged);
  console.log('Flagedusers:', flagged?.userData);
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <UserNavbar fromwhere="moderator" />
      </Suspense>
    </div>
  );
}

export default ModeratorDashboard;
