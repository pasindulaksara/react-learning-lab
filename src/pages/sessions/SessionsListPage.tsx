import React from "react";
import { Link } from "react-router-dom";

type SessionStatus = "active" | "completed";

type Session = {
  id: string;
  parentName: string;
  children: number;
  startTime: string;
  endTime?: string;
  duration: string;
  status: SessionStatus;
};

const mockSessions: Session[] = [
  {
    id: "1",
    parentName: "Lakshika Perera",
    children: 2,
    startTime: "15:00",
    endTime: "",
    duration: "35 min",
    status: "active",
  },
  {
    id: "2",
    parentName: "Nuwan Silva",
    children: 1,
    startTime: "16:10",
    endTime: "18:10",
    duration: "2h",
    status: "completed",
  },
];

export default function SessionsListPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Sessions</h1>
        <p className="text-sm text-gray-500">
          View and manage all play sessions
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-sm text-gray-500">Active sessions</p>
          <p className="text-2xl font-semibold">2</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-sm text-gray-500">Completed today</p>
          <p className="text-2xl font-semibold">2</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-sm text-gray-500">Total today</p>
          <p className="text-2xl font-semibold">4</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow mb-4 flex gap-4">
        <select className="border rounded px-3 py-2 text-sm">
          <option>All sessions</option>
          <option>Active</option>
          <option>Completed</option>
        </select>

        <select className="border rounded px-3 py-2 text-sm">
          <option>Today</option>
          <option>This week</option>
          <option>Custom range</option>
        </select>
      </div>

      {/* Table */}
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
            {mockSessions.map((s) => (
              <tr key={s.id} className="border-b last:border-0">
                <td className="p-3 font-medium">{s.parentName}</td>
                <td className="p-3">{s.children}</td>
                <td className="p-3">{s.startTime}</td>
                <td className="p-3">{s.endTime || "-"}</td>
                <td className="p-3">{s.duration}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
