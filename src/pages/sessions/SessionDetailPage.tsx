import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";

type SessionStatus = "active" | "completed";

type Session = {
  id: string;
  parentName: string;
  children: { name: string; age?: number }[];
  startTime: string; // "15:00"
  endTime?: string; // "18:10"
  duration: string; // "35 min" / "2h"
  status: SessionStatus;
  highlightOnBoard?: boolean;

  // payment preview (UI only)
  pricing: {
    hourlyRate: number;
    baseAmount: number;
    discount: number;
    reward: number;
    finalAmount: number;
    paymentMethod: "Cash" | "Card" | "Pending";
  };
};

const mockSessions: Session[] = [
  {
    id: "1",
    parentName: "Lakshika Perera",
    children: [{ name: "Child 1", age: 5 }, { name: "Child 2", age: 3 }],
    startTime: "15:00",
    duration: "35 min",
    status: "active",
    highlightOnBoard: true,
    pricing: {
      hourlyRate: 1200,
      baseAmount: 700,
      discount: 0,
      reward: 0,
      finalAmount: 700,
      paymentMethod: "Pending",
    },
  },
  {
    id: "2",
    parentName: "Nuwan Silva",
    children: [{ name: "Child 1", age: 4 }],
    startTime: "16:10",
    endTime: "18:10",
    duration: "2h",
    status: "completed",
    highlightOnBoard: false,
    pricing: {
      hourlyRate: 1200,
      baseAmount: 2400,
      discount: 0,
      reward: 0,
      finalAmount: 2400,
      paymentMethod: "Cash",
    },
  },
];

function StatusBadge({ status }: { status: SessionStatus }) {
  const cls =
    status === "active"
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-700";
  return (
    <span className={`px-2 py-1 rounded text-xs capitalize ${cls}`}>
      {status}
    </span>
  );
}

export default function SessionDetailPage() {
  const { id } = useParams<{ id: string }>();

  const session = useMemo(
    () => mockSessions.find((s) => s.id === id),
    [id]
  );

  if (!session) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-xl font-semibold mb-2">Session not found</h1>
          <p className="text-sm text-gray-500 mb-4">
            The session you are looking for does not exist (mock data).
          </p>
          <Link to="/sessions" className="text-blue-600 hover:underline">
            Back to Sessions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">Session Details</h1>
            <StatusBadge status={session.status} />
            {session.highlightOnBoard && (
              <span className="px-2 py-1 rounded text-xs bg-blue-50 text-blue-700">
                highlighted on display board
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">
            View session summary, children and payment preview
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/sessions"
            className="px-4 py-2 rounded border bg-white hover:bg-gray-50 text-sm"
          >
            Back
          </Link>

          <button
            className="px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50"
            disabled={session.status !== "active"}
            title={
              session.status !== "active"
                ? "Only active sessions can be ended"
                : "End this session"
            }
          >
            End session
          </button>
        </div>
      </div>

      {/* Top summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Parent</p>
          <p className="text-lg font-semibold">{session.parentName}</p>
          <p className="text-sm text-gray-500">
            {session.children.length} child{session.children.length > 1 ? "ren" : ""}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Time</p>
          <p className="text-lg font-semibold">
            {session.startTime}{" "}
            <span className="text-gray-400 font-normal">→</span>{" "}
            {session.endTime || "-"}
          </p>
          <p className="text-sm text-gray-500">Duration: {session.duration}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Payment</p>
          <p className="text-lg font-semibold">
            Rs. {session.pricing.finalAmount.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            Method: {session.pricing.paymentMethod}
          </p>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Children */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-3">Children</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Age</th>
                </tr>
              </thead>
              <tbody>
                {session.children.map((c, idx) => (
                  <tr key={idx} className="border-b last:border-0">
                    <td className="p-3 font-medium">{c.name}</td>
                    <td className="p-3">{c.age ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-400 mt-3">
            This is mock data for UI. Later we’ll connect real children records.
          </p>
        </div>

        {/* Payment breakdown */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-3">Payment breakdown</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Hourly rate</span>
              <span>Rs. {session.pricing.hourlyRate.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Base amount</span>
              <span>Rs. {session.pricing.baseAmount.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Discount</span>
              <span>- Rs. {session.pricing.discount.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Reward</span>
              <span>- Rs. {session.pricing.reward.toLocaleString()}</span>
            </div>

            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>Rs. {session.pricing.finalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-4">
            <button className="w-full px-4 py-2 rounded border bg-white hover:bg-gray-50 text-sm">
              Print receipt (UI)
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-3">
            Next step: connect to earnings + payment records.
          </p>
        </div>
      </div>
    </div>
  );
}
