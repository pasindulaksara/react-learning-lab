// src/pages/dashboard/DashboardPage.tsx

import { Link } from "react-router-dom";

type ActiveSession = {
  id: number;
  parentName: string;
  childrenCount: number;
  startedAt: string;
  endsAt: string;
  minutesLeft: number;
};

type CompletedSession = {
  id: number;
  parentName: string;
  childrenCount: number;
  startTime: string;
  endTime: string;
  durationMinutes: number;
};

const MOCK_ACTIVE_SESSIONS: ActiveSession[] = [
  {
    id: 1,
    parentName: "Lakshika Perera",
    childrenCount: 2,
    startedAt: "15:00",
    endsAt: "17:00",
    minutesLeft: 35,
  },
  {
    id: 2,
    parentName: "Nuwan Silva",
    childrenCount: 1,
    startedAt: "16:10",
    endsAt: "18:10",
    minutesLeft: 85,
  },
];

const MOCK_COMPLETED_TODAY: CompletedSession[] = [
  {
    id: 3,
    parentName: "Tharindu Jayasinghe",
    childrenCount: 3,
    startTime: "10:00",
    endTime: "12:00",
    durationMinutes: 120,
  },
  {
    id: 4,
    parentName: "Ishara Fernando",
    childrenCount: 1,
    startTime: "13:00",
    endTime: "15:00",
    durationMinutes: 120,
  },
];

export default function DashboardPage() {
  const totalActiveChildren = MOCK_ACTIVE_SESSIONS.reduce(
    (sum, s) => sum + s.childrenCount,
    0
  );
  const todaysVisitors =
    totalActiveChildren +
    MOCK_COMPLETED_TODAY.reduce((sum, s) => sum + s.childrenCount, 0);

  const rewardsTriggeredToday = 1; // mock for now
   // mock for now
   

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Quick overview of today at Tiny Town: active sessions, visitors and
            shortcuts for staff.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/start-session"
            className="inline-flex items-center rounded-lg bg-sky-500 px-4 py-2 text-xs sm:text-sm font-medium text-white shadow-sm hover:bg-sky-600"
          >
            Start new session
          </Link>
          <Link
            to="/display"
            className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Open display board
          </Link>
        </div>
      </div>

      {/* Top KPI cards */}
      <div className="grid gap-4 sm:gap-5 sm:grid-cols-4 mb-6">
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-4">
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
            Active sessions now
          </div>
          <div className="text-2xl font-semibold text-slate-900">
            {MOCK_ACTIVE_SESSIONS.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {totalActiveChildren} child
            {totalActiveChildren !== 1 ? "ren" : ""} currently inside.
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-4">
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
            Today&apos;s visitors
          </div>
          <div className="text-2xl font-semibold text-slate-900">
            {todaysVisitors}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Based on active + completed sessions.
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-4">
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
            Sessions today
          </div>
          <div className="text-2xl font-semibold text-slate-900">
            {MOCK_ACTIVE_SESSIONS.length + MOCK_COMPLETED_TODAY.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {MOCK_COMPLETED_TODAY.length} completed ·{" "}
            {MOCK_ACTIVE_SESSIONS.length} running.
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-4">
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
            Rewards today
          </div>
          <div className="text-2xl font-semibold text-emerald-600">
            {rewardsTriggeredToday}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Families who unlocked Rs. 1000 off / 1 free hour today.
          </div>
        </div>
      </div>

      {/* Middle: active sessions + quick actions */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_minmax(0,1fr)] mb-6">
        {/* Active sessions panel */}
        <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Active sessions
            </h2>
            <span className="text-xs text-slate-500">
              {MOCK_ACTIVE_SESSIONS.length} session
              {MOCK_ACTIVE_SESSIONS.length !== 1 ? "s" : ""} running
            </span>
          </div>

          {MOCK_ACTIVE_SESSIONS.length === 0 ? (
            <div className="text-sm text-slate-500">
              No active sessions right now.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {MOCK_ACTIVE_SESSIONS.map((s) => (
                <div
                  key={s.id}
                  className="py-2.5 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-sm font-medium text-slate-900">
                      {s.parentName}
                    </div>
                    <div className="text-xs text-slate-500">
                      {s.childrenCount} child
                      {s.childrenCount !== 1 ? "ren" : ""} · {s.startedAt} –{" "}
                      {s.endsAt}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-xs font-semibold ${
                        s.minutesLeft <= 15
                          ? "text-red-600"
                          : s.minutesLeft <= 30
                          ? "text-amber-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {s.minutesLeft} min left
                    </div>
                    <div className="text-[0.7rem] text-slate-400">
                      Highlighted on display board.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick actions / alerts */}
        <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-4 sm:p-5 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 mb-2">
              Quick actions
            </h2>
            <div className="flex flex-col gap-2">
              <Link
                to="/register"
                className="inline-flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50"
              >
                <span>Register new parent & children</span>
                <span className="text-sky-500 text-xs font-medium">
                  Go to Registration →
                </span>
              </Link>
              <Link
                to="/parents"
                className="inline-flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50"
              >
                <span>View all parents</span>
                <span className="text-sky-500 text-xs font-medium">
                  Open Parents →
                </span>
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900 mb-2">
              Reward alerts
            </h2>
            <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              Today{" "}
              <span className="font-semibold text-emerald-600">
                {rewardsTriggeredToday} family
                {rewardsTriggeredToday !== 1 ? "ies" : ""}
              </span>{" "}
              unlocked a reward. Remember to mention their free hour / Rs. 1000
              off during payment.
            </div>
          </div>
        </section>
      </div>

      {/* Bottom: Today completed sessions */}
      <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Today&apos;s completed sessions
          </h2>
          <span className="text-xs text-slate-500">
            {MOCK_COMPLETED_TODAY.length} session
            {MOCK_COMPLETED_TODAY.length !== 1 ? "s" : ""} completed
          </span>
        </div>

        {MOCK_COMPLETED_TODAY.length === 0 ? (
          <div className="text-sm text-slate-500">
            No completed sessions recorded yet today.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs sm:text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-100">
                  <th className="py-2 pr-3 font-medium">Parent</th>
                  <th className="py-2 px-3 font-medium">Children</th>
                  <th className="py-2 px-3 font-medium">Time</th>
                  <th className="py-2 px-3 font-medium">Duration</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_COMPLETED_TODAY.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b last:border-b-0 border-slate-50"
                  >
                    <td className="py-2.5 pr-3 whitespace-nowrap text-slate-700">
                      {s.parentName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">
                      {s.childrenCount}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-700">
                      {s.startTime} – {s.endTime}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-700">
                      {s.durationMinutes / 60} h
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
