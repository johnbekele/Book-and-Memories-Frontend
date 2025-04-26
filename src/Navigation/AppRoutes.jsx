import React, { lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import AuthProvider from '../Context/AuthProvider';
import ProtectedRoute from '../Navigation/ProtectRoutes';
import LoadingSpinner from '../Components/LoadingSpinner';
import SmallSpinner from '../Components/SmallSpinner';
import useSaveLastLocation from '../Hook/useSaveLastLocation.js';

const LoginPage = lazy(() => import('../Pages/LoginPage'));
const AuthSuccess = lazy(() => import('../Hook/AuthSuccess'));
const UserDashboard = lazy(() => import('../Pages/Dashboards/UserDashboard'));
const ModeratorDashboard = lazy(() =>
  import('../Pages/Dashboards/ModeratorDashboard')
);
const AdminDashboard = lazy(() => import('../Pages/Dashboards/AdminDashboard'));
const AddBookPage = lazy(() => import('../Pages/UserPages/AddBookPage'));
const Profile = lazy(() => import('../Components/ProfilePage.jsx'));
const FeedPage = lazy(() => import('../Pages/UserPages/FeedPage.jsx'));
const MyLibrary = lazy(() => import('../Components/MyLibrary.jsx'));
const Chat = lazy(() => import('../Components/Chat.jsx'));

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
        <InnerRoutes />
      </AuthProvider>
    </Router>
  );
};

const InnerRoutes = () => {
  useSaveLastLocation(); // Now inside router context

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <LoginPage />
          </Suspense>
        }
      />

      <Route
        path="/auth-success"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <AuthSuccess />
          </Suspense>
        }
      />

      {/* Protected User Routes */}
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <Suspense fallback={<LoadingSpinner />}>
              <UserDashboard />
            </Suspense>
          </ProtectedRoute>
        }
      >
        {/* Nested User Dashboard Routes */}
        <Route
          index
          element={
            <Suspense fallback={<SmallSpinner />}>
              <FeedPage />
            </Suspense>
          }
        />
        {/* <Route
          path="books/add"
          element={
            <Suspense fallback={<SmallSpinner />}>
              <AddBookPage />
            </Suspense>
          }
        /> */}
        <Route
          path="library"
          element={
            <Suspense fallback={<SmallSpinner />}>
              <MyLibrary />
            </Suspense>
          }
        />
        <Route
          path="profile"
          element={
            <Suspense fallback={<SmallSpinner />}>
              <Profile />
            </Suspense>
          }
        />
        <Route
          path="chat"
          element={
            <Suspense fallback={<SmallSpinner />}>
              <Chat />
            </Suspense>
          }
        />
      </Route>

      {/* Protected Moderator Routes */}
      <Route
        path="/moderator-dashboard"
        element={
          <ProtectedRoute allowedRoles={['moderator']}>
            <Suspense fallback={<LoadingSpinner />}>
              <ModeratorDashboard />
            </Suspense>
          </ProtectedRoute>
        }
      >
        {/* Add nested routes for moderator dashboard if needed */}
        <Route
          path="profile"
          element={
            <Suspense fallback={<SmallSpinner />}>
              <Profile />
            </Suspense>
          }
        />
        {/* You can add other moderator-specific routes here */}
      </Route>

      {/* Protected Admin Routes */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Suspense fallback={<LoadingSpinner />}>
              <AdminDashboard />
            </Suspense>
          </ProtectedRoute>
        }
      >
        {/* Add nested routes for admin dashboard */}
        <Route
          index
          element={
            <Suspense fallback={<SmallSpinner />}>
              <AdminDashboard />
            </Suspense>
          }
        />
        <Route
          path="profile"
          element={
            <Suspense fallback={<SmallSpinner />}>
              <Profile />
            </Suspense>
          }
        />
        {/* You can add other admin-specific routes here */}
      </Route>

      {/* Home */}
      <Route path="/" element={<Navigate to="/user-dashboard" />} />
      <Route path="*" element={<Navigate to="/user-dashboard" />} />
    </Routes>
  );
};

export default AppRoutes;
