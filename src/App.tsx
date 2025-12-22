import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import RegisterParentPage from "./pages/registration/RegisterParentPage";
import StartSessionPage from "./pages/sessions/StartSessionPage";
import DisplayBoardPage from "./pages/sessions/DisplayBoardPage";
import AppLayout from "./components/layout/AppLayout";

import ParentDetailPage from "./pages/parents/ParentDetailPage";
import ParentsListPage from "./pages/parents/ParentsListPage";

import DashboardPage from "./pages/dashboard/DashboardPage"; // <-- ADD THIS
import SessionsListPage from "./pages/sessions/SessionsListPage";
import SessionDetailPage from "./pages/sessions/SessionDetailPage";
import EarningsPage from "./pages/earnings/EarningsPage";
import SettingsPage from "./pages/Settings/SettingsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---- DASHBOARD (HOME) ---- */}
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          }
        />

        {/* ---- Parent List ---- */}
        <Route
          path="/parents"
          element={
            <AppLayout>
              <ParentsListPage />
            </AppLayout>
          }
        />

        {/* ---- Parent Detail ---- */}
        <Route
          path="/parent/:id"
          element={
            <AppLayout>
              <ParentDetailPage />
            </AppLayout>
          }
        />

        <Route path="/parent-demo" element={<ParentDetailPage />} />

        {/* ---- Registration ---- */}
        <Route
          path="/register"
          element={
            <AppLayout>
              <RegisterParentPage />
            </AppLayout>
          }
        />

        {/* ---- Start Session ---- */}
        <Route
          path="/start-session"
          element={
            <AppLayout>
              <StartSessionPage />
            </AppLayout>
          }
        />
        <Route
          path="/sessions"
          element={
            <AppLayout>
              <SessionsListPage />
            </AppLayout>
          }
        />

        <Route
          path="/sessions/:id"
          element={
            <AppLayout>
              <SessionDetailPage />
            </AppLayout>
          }
        />

        <Route
          path="/earnings"
          element={
            <AppLayout>
              <EarningsPage />
            </AppLayout>
          }
        />

        <Route
          path="/settings"
          element={
            <AppLayout>
              <SettingsPage />
            </AppLayout>
          }
        />

        {/* ---- Display Screen (NO layout header) ---- */}
        <Route path="/display" element={<DisplayBoardPage />} />

        {/* ---- DEFAULT ROUTE: redirect to dashboard ---- */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* ---- CATCH-ALL ---- */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
