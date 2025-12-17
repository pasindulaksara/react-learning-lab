// src/components/layout/AppLayout.tsx
import type  { ReactNode } from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "../../assets/logo.jpg";

type Props = {
  children: ReactNode;
};

export default function AppLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* LEFT: LOGO + BRAND */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <img
              src={logo}
              alt="Tiny Town Logo"
              className="h-10 w-auto sm:h-12 transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-base sm:text-lg font-semibold text-slate-900">
                Tiny Town
              </span>
              <span className="text-xs text-slate-500">
                Indoor Playground
              </span>
            </div>
          </Link>

          {/* RIGHT: NAVIGATION */}
          <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full font-medium transition ${
                  isActive
                    ? "bg-sky-500 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/register"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full font-medium transition ${
                  isActive
                    ? "bg-sky-500 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              Registration
            </NavLink>

            <NavLink
              to="/start-session"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full font-medium transition ${
                  isActive
                    ? "bg-sky-500 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              Start Session
            </NavLink>

            <NavLink
              to="/display"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-slate-50 shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              Display Board
            </NavLink>

            <NavLink
              to="/parents"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full font-medium transition ${
                  isActive
                    ? "bg-sky-500 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              Parents
            </NavLink>

            <NavLink
              to="/sessions"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full font-medium transition ${
                  isActive
                    ? "bg-sky-500 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              Sessions
            </NavLink>

            <NavLink
              to="/earnings"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full font-medium transition ${
                  isActive
                    ? "bg-sky-500 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              Earnings
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full font-medium transition ${
                  isActive
                    ? "bg-sky-500 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              Settings
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-stretch justify-center">
        {children}
      </main>
    </div>
  );
}
