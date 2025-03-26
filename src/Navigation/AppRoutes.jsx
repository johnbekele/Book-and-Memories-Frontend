import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const LoginForm = lazy(() => import('./Pages/Dashboard/LoginForm'));
const UserDashboard = lazy(() => import('./Pages/Dashboard/UserDashboard'));
const ModeratoreDashboard = lazy(() =>
  import('./Pages/Dashboard/ModeratoreDashboard')
);
const AdminDashboard = lazy(() => import('./Pages/Dashboard/AdminDashboard'));

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />

          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute roles={['User']}>
                <Suspense fallback={<div>Loading...</div>}>
                  <UserDashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/moderatore-dashboard"
            element={
              <ProtectedRoute roles={['Moderatore']}>
                <Suspense fallback={<div>Loading...</div>}>
                  <ModeratoreDashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute roles={['Admin']}>
                <Suspense fallback={<div>Loading...</div>}>
                  <AdminDashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* Default Redirect */}
          <Route path="*" element={<LoginForm />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes;
