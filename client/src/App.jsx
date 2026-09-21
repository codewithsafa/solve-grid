import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import ReportPage from './pages/ReportPage';
import ProblemsPage from './pages/ProblemsPage';
import InnovationHubPage from './pages/InnovationHubPage';
import TrackProblemsPage from './pages/TrackProblemsPage';
import DashboardPage from './pages/DashboardPage';

// Layout wrapper for Main Application (desktop sidebar + content area)
function AppLayout({ children }) {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Screen 1: Welcome / Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Main Application Routes */}
      <Route
        path="/report"
        element={
          <AppLayout>
            <ReportPage />
          </AppLayout>
        }
      />
      <Route
        path="/problems"
        element={
          <AppLayout>
            <ProblemsPage />
          </AppLayout>
        }
      />
      <Route
        path="/hub"
        element={
          <AppLayout>
            <InnovationHubPage />
          </AppLayout>
        }
      />
      <Route
        path="/track"
        element={
          <AppLayout>
            <TrackProblemsPage />
          </AppLayout>
        }
      />
      <Route
        path="/dashboard"
        element={
          <AppLayout>
            <DashboardPage />
          </AppLayout>
        }
      />

      {/* Fallback to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
