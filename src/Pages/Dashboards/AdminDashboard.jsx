import React, { lazy, Suspense } from 'react';
import { useFlagged } from '../../Hook/useFlagged';

import TabMenu from '../../Components/TabMenu';

//React.lazy load
const UserNavbar = lazy(() => import('../../Components/UserNavBar'));
const FlaggedUserPage = lazy(() => import('../AdminPages/UserManagementPage'));
const ActionAnalysis = lazy(() =>
  import('../ModeratorePages/ActionAnalysisPage')
);
const ReportedInteraction = lazy(() =>
  import('../ModeratorePages/ReportedInteractionPage')
);

function ModeratorDashboard() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <UserNavbar fromwhere="moderator" />
        <TabMenu
          tab1Label="Flagged Users"
          tab2Label="Reported Interactions"
          tab3Label="Action Analysis"
          Tab1Component={<FlaggedUserPage />}
          Tab2Component={<ReportedInteraction />}
          Tab3Component={<ActionAnalysis />}
        />
      </Suspense>
    </div>
  );
}

export default ModeratorDashboard;
