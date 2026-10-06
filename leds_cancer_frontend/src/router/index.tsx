import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Pages — thin wrappers sobre os features
import { AuthPage }        from '@/pages/AuthPage';
import { DashboardPage }   from '@/pages/DashboardPage';
import { PatientsPage }    from '@/pages/PatientsPage';
import { NewAnalysisPage } from '@/pages/NewAnalysisPage';
import { HistoryPage }     from '@/pages/HistoryPage';
import { SettingsPage }    from '@/pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true,       element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'patients',  element: <PatientsPage /> },
          { path: 'new-exam',  element: <NewAnalysisPage /> },
          { path: 'history',   element: <HistoryPage /> },
          { path: 'settings',  element: <SettingsPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/auth" replace />,
  },
], { basename: '/leds_cancer' });
