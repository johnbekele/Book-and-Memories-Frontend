import React, { lazy, Suspense } from 'react';

const UserNavbar = lazy(() => import('../../Components/UserNavBar'));
function AdminDashboard() {
  return (
    <div>
      <UserNavbar fromwhere="admin" />
    </div>
  );
}

export default AdminDashboard;
