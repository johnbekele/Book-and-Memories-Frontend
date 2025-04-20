import React, { lazy, Suspense } from 'react';
import { useFlagged } from '../../Hook/useFlagged';

import TabMenu from '../../Components/TabMenu';

//React.lazy load
const UserNavbar = lazy(() => import('../../Components/UserNavBar'));
const UserManagementPage = lazy(() =>
  import('../AdminPages/UserManagementPage')
);
const ActionAnalysis = lazy(() =>
  import('../ModeratorePages/ActionAnalysisPage')
);
const ReportedInteraction = lazy(() =>
  import('../ModeratorePages/ReportedInteractionPage')
);

const FlaggedUserPage = lazy(() =>
  import('../ModeratorePages/FlaggedUserPage')
);

function ModeratorDashboard() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <UserNavbar fromwhere="admin" />
        <TabMenu
          tabs={[
            { label: 'User Management', component: <UserManagementPage /> },
            { label: 'Flagged Users', component: <FlaggedUserPage /> },
            { label: 'Ticket Management', component: <ReportedInteraction /> },
            { label: 'Action Analysis ', component: <ActionAnalysis /> },
          ]}
        />
      </Suspense>
    </div>
  );
}

export default ModeratorDashboard;
