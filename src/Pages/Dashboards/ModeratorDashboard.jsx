import React, { lazy, Suspense } from 'react';
import { useFlagged } from '../../Hook/useFlagged';

import TabMenu from '../../Components/TabMenu';

//React.lazy load
const UserNavbar = lazy(() => import('../../Components/UserNavBar'));
const FlaggedUserPage = lazy(() =>
  import('../ModeratorePages/FlaggedUserPage')
);
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
          tabs={[
            { label: 'Flagged Users', component: <FlaggedUserPage /> },
            {
              label: 'Reported Interaction',
              component: <ReportedInteraction />,
            },
            { label: 'Action Analysis ', component: <ActionAnalysis /> },
          ]}
        />
      </Suspense>
    </div>
  );
}

export default ModeratorDashboard;
