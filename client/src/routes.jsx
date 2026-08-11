import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { PageLoadingSpinner } from './components/Skeleton.jsx';

// ---- Page imports (lazy loaded with React.lazy for code splitting) ----
const Home = lazy(() => import('./pages/Home.jsx'));
const Explore = lazy(() => import('./pages/Explore.jsx'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword.jsx'));
const ResetPassword = lazy(() => import('./pages/ResetPassword.jsx'));
const SubmitProject = lazy(() => import('./pages/SubmitProject.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const Leaderboard = lazy(() => import('./pages/Leaderboard.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

// Helper component to wrap route elements in Suspense
const withSuspense = (Component) => (
  <Suspense fallback={<PageLoadingSpinner />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  // ---- Public Routes ----
  { path: '/', element: withSuspense(Home) },
  { path: '/explore', element: withSuspense(Explore) },
  { path: '/projects/:id', element: withSuspense(ProjectDetail) },
  { path: '/login', element: withSuspense(Login) },
  { path: '/register', element: withSuspense(Register) },
  { path: '/forgot-password', element: withSuspense(ForgotPassword) },
  { path: '/reset-password/:token', element: withSuspense(ResetPassword) },
  { path: '/leaderboard', element: withSuspense(Leaderboard) },
  { path: '/profile', element: withSuspense(Profile) },
  { path: '/profile/:id', element: withSuspense(Profile) },
  { path: '/users/:id', element: withSuspense(Profile) },

  // ---- Protected Routes ----
  {
    path: '/submit',
    element: (
      <ProtectedRoute>
        {withSuspense(SubmitProject)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        {withSuspense(Dashboard)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/projects/:id/edit',
    element: (
      <ProtectedRoute>
        {withSuspense(SubmitProject)}
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute adminOnly={true}>
        {withSuspense(AdminDashboard)}
      </ProtectedRoute>
    ),
  },

  // ---- 404 ----
  { path: '*', element: withSuspense(NotFound) },
]);

export default router;
