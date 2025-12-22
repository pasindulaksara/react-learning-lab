import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getSessions, type SessionRow, type SessionStatus } from "../../api/sessions";

type RangeFilter = "today" | "week" | "all";
type StatusFilter = "all" | SessionStatus;

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatHM(iso: string) {
  const d = new Date(iso);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function durationTextFromTimes(startIso: string, endIso: string | null) {
  const start = new Date(startIso).getTime();
  const end = endIso ? new Date(endIso).getTime() : Date.now();
  const diffMin = Math.max(Math.floor((end - start) / 60000), 0);

  const h = Math.floor(diffMin / 60);
  const m = diffMin % 60;

  if (h <= 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export default function SessionsListPage() {
  const [rows, setRows] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [status, setStatus] = useState<StatusFilter>("all");
  const [range, setRange] = useState<RangeFilter>("today");

  // ✅ tick to re-render durations automatically
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setTick((x) => x + 1), 30_000); // 30s
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");

    getSessions({ status, range })
      .then((data) => {
        if (!alive) return;
        setRows(data);
      })
      .catch((e: any) => {
        if (!alive) return;
        setRows([]);
        setError(e?.response?.data?.error || "Failed to load sessions");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [status, range]);

  const ui = useMemo(() => {
    // ✅ tick included so durations refresh without page reload
    void tick;

    return rows.map((s) => ({
      id: Number(s.id),
      parentName: s.parent_name,
      children: Number(s.children_count),
      start: formatHM(s.start_time),
      end: s.end_time ? formatHM(s.end_time) : "",
      duration: durationTextFromTimes(s.start_time, s.end_time),
      status: s.status,
    }));
  }, [rows, tick]);

  const activeCount = useMemo(() => ui.filter((x) => x.status === "active").length, [ui]);
  const completedCount = useMemo(() => ui.filter((x) => x.status === "completed").length, [ui]);
  const totalCount = ui.length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Sessions</h1>
        <p className="text-sm text-gray-500">View and manage all play sessions</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 px-4 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-sm text-gray-500">Active sessions</p>
          <p className="text-2xl font-semibold">{loading ? "—" : activeCount}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-semibold">{loading ? "—" : completedCount}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-semibold">{loading ? "—" : totalCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow mb-4 flex gap-4">
        <select
          className="border rounded px-3 py-2 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusFilter)}
        >
          <option value="all">All sessions</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>

        <select
          className="border rounded px-3 py-2 text-sm"
          value={range}
          onChange={(e) => setRange(e.target.value as RangeFilter)}
        >
          <option value="today">Today</option>
          <option value="week">This week</option>
          <option value="all">All time</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="text-left p-3">Parent</th>
              <th className="text-left p-3">Children</th>
              <th className="text-left p-3">Start</th>
              <th className="text-left p-3">End</th>
              <th className="text-left p-3">Duration</th>
              <th className="text-left p-3">Status</th>
              <th className="text-right p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-6 text-gray-500">
                  Loading sessions…
                </td>
              </tr>
            ) : ui.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-gray-500">
                  No sessions found.
                </td>
              </tr>
            ) : (
              ui.map((s) => (
                <tr key={s.id} className="border-b last:border-0">
                  <td className="p-3 font-medium">{s.parentName}</td>
                  <td className="p-3">{s.children}</td>
                  <td className="p-3">{s.start}</td>
                  <td className="p-3">{s.end || "-"}</td>
                  <td className="p-3">{s.duration}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs capitalize ${
                        s.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link to={`/sessions/${s.id}`} className="text-blue-600 hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
