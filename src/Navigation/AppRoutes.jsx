import { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import AuthProvider from '../Context/AuthProvider';
import ProtectedRoute from '../Navigation/ProtectRoutes';
import LoadingSpinner from '../Components/LoadingSpinner';

const LoginPage = lazy(() => import('../Pages/LoginPage'));
const AuthSuccess = lazy(() => import('../Components/AuthSuccess'));
const UserDashboard = lazy(() => import('../Pages/Dashboards/UserDashboard'));
const ModeratorDashboard = lazy(() =>
  import('../Pages/Dashboards/ModeratorDashboard')
);
const AdminDashboard = lazy(() => import('../Pages/Dashboards/AdminDashboard'));

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
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
          />

          <Route
            path="/moderator-dashboard"
            element={
              <ProtectedRoute requiredRole="Moderator">
                <Suspense fallback={<LoadingSpinner />}>
                  <ModeratorDashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute requiredRole="Admin">
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminDashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* Home Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Catch All */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;
