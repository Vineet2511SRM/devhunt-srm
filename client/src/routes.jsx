import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// ---- Page imports (lazy loaded for performance) ----
// These are placeholder components for now. We will replace them
// with full implementations as we build each page (3.3 → 3.10).
import Home from './pages/Home.jsx';
import Explore from './pages/Explore.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import SubmitProject from './pages/SubmitProject.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import NotFound from './pages/NotFound.jsx';

const router = createBrowserRouter([
  // ---- Public Routes ----
  { path: '/', element: <Home /> },
  { path: '/explore', element: <Explore /> },
  { path: '/projects/:id', element: <ProjectDetail /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/leaderboard', element: <Leaderboard /> },
  { path: '/users/:id', element: <Profile /> },

  // ---- Protected Routes ----
  {
    path: '/submit',
    element: (
      <ProtectedRoute>
        <SubmitProject />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/projects/:id/edit',
    element: (
      <ProtectedRoute>
        <SubmitProject />
      </ProtectedRoute>
    ),
  },

  // ---- 404 ----
  { path: '*', element: <NotFound /> },
]);

export default router;
