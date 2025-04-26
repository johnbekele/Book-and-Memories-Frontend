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
  useSaveLastLocation(); // <--- NOW INSIDE ROUTER CONTEXT

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <Suspense fallback={<SmallSpinner />}>
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

      {/* Protected Routes */}
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute requiredRole="User">
            <Suspense fallback={<LoadingSpinner />}>
              <UserDashboard />
            </Suspense>
          </ProtectedRoute>
        }
      >
        <Route
          path="books/add"
          element={
            <ProtectedRoute requiredRole="User">
              <Suspense fallback={<LoadingSpinner />}>
                <AddBookPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        path="/moderator-dashboard"
        element={
          <ProtectedRoute requiredRole="Moderator">
            <Suspense fallback={<SmallSpinner />}>
              <ModeratorDashboard />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute requiredRole="Admin">
            <Suspense fallback={<SmallSpinner />}>
              <AdminDashboard />
            </Suspense>
          </ProtectedRoute>
        }
      />

      {/* Home */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
