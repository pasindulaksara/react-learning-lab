import { useMemo, useState } from "react";

type PaymentMethod = "Cash" | "Bank Transfer";
type EarningRow = {
  id: string;
  date: string; // "2025-12-17"
  parentName: string;
  duration: string; // "35 min" / "2h"
  baseAmount: number;
  discount: number; // e.g. 1000
  reward: number; // e.g. 0
  finalAmount: number;
  method: PaymentMethod;
};

const MOCK_EARNINGS: EarningRow[] = [
  {
    id: "e1",
    date: "2025-12-17",
    parentName: "Lakshika Perera",
    duration: "1h 20m",
    baseAmount: 1600,
    discount: 0,
    reward: 0,
    finalAmount: 1600,
    method: "Cash",
  },
  {
    id: "e2",
    date: "2025-12-17",
    parentName: "Nuwan Silva",
    duration: "2h",
    baseAmount: 2400,
    discount: 0,
    reward: 0,
    finalAmount: 2400,
    method: "Bank Transfer",
  },
  {
    id: "e3",
    date: "2025-12-16",
    parentName: "Sanduni Jayasuriya",
    duration: "2h",
    baseAmount: 2400,
    discount: 1000,
    reward: 0,
    finalAmount: 1400,
    method: "Cash",
  },
  {
    id: "e4",
    date: "2025-12-15",
    parentName: "Isuru Fernando",
    duration: "45 min",
    baseAmount: 900,
    discount: 0,
    reward: 0,
    finalAmount: 900,
    method: "Cash",
  },
];

function formatLKR(amount: number) {
  return `Rs. ${amount.toLocaleString()}`;
}

function toDateOnlyISO(d: Date) {
  // yyyy-mm-dd in local time
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfWeek(d: Date) {
  const copy = new Date(d);
  const day = copy.getDay(); // 0 Sun
  const diff = (day === 0 ? -6 : 1) - day; // make Monday start
  copy.setDate(copy.getDate() + diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function startOfMonth(d: Date) {
  const copy = new Date(d);
  copy.setDate(1);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export default function EarningsPage() {
  const [dateFilter, setDateFilter] = useState<
    "today" | "week" | "month" | "all"
  >("today");
  const [methodFilter, setMethodFilter] = useState<"all" | PaymentMethod>(
    "all"
  );

  const now = useMemo(() => new Date(), []);
  const todayISO = useMemo(() => toDateOnlyISO(now), [now]);

  const filtered = useMemo(() => {
    const rows = MOCK_EARNINGS.slice();

    const afterDateISO = (() => {
      if (dateFilter === "today") return toDateOnlyISO(now);
      if (dateFilter === "week") return toDateOnlyISO(startOfWeek(now));
      if (dateFilter === "month") return toDateOnlyISO(startOfMonth(now));
      return null;
    })();

    return rows.filter((r) => {
      const methodOk =
        methodFilter === "all" ? true : r.method === methodFilter;
      const dateOk = afterDateISO ? r.date >= afterDateISO : true;
      return methodOk && dateOk;
    });
  }, [dateFilter, methodFilter, now]);

  const summary = useMemo(() => {
    const todayRows = MOCK_EARNINGS.filter((r) => r.date === todayISO);
    const monthStartISO = toDateOnlyISO(startOfMonth(now));
    const monthRows = MOCK_EARNINGS.filter((r) => r.date >= monthStartISO);

    const todayTotal = todayRows.reduce((sum, r) => sum + r.finalAmount, 0);
    const monthTotal = monthRows.reduce((sum, r) => sum + r.finalAmount, 0);
    const paidSessionsToday = todayRows.length;

    return { todayTotal, monthTotal, paidSessionsToday };
  }, [now, todayISO]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Earnings</h1>
        <p className="text-sm text-gray-500">
          Overview of payments and revenue from completed sessions
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-sm text-gray-500">Today’s earnings</p>
          <p className="text-2xl font-semibold">
            {formatLKR(summary.todayTotal)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Based on completed sessions today
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-sm text-gray-500">This month</p>
          <p className="text-2xl font-semibold">
            {formatLKR(summary.monthTotal)}
          </p>
          <p className="text-xs text-gray-400 mt-1">Month-to-date revenue</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-sm text-gray-500">Paid sessions today</p>
          <p className="text-2xl font-semibold">{summary.paidSessionsToday}</p>
          <p className="text-xs text-gray-400 mt-1">
            Count of payments collected
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow mb-4 flex flex-wrap gap-3 items-center">
        <div className="flex gap-3">
          <select
            className="border rounded px-3 py-2 text-sm"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
          >
            <option value="today">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
            <option value="all">All time</option>
          </select>

          <select
            className="border rounded px-3 py-2 text-sm"
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value as any)}
          >
            <option value="all">All methods</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>

        <div className="ml-auto text-sm text-gray-500">
          Showing{" "}
          <span className="font-medium text-gray-800">{filtered.length}</span>{" "}
          record{filtered.length === 1 ? "" : "s"}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Parent</th>
              <th className="text-left p-3">Duration</th>
              <th className="text-left p-3">Base</th>
              <th className="text-left p-3">Discount</th>
              <th className="text-left p-3">Reward</th>
              <th className="text-left p-3">Final</th>
              <th className="text-left p-3">Method</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="p-3">{r.date}</td>
                <td className="p-3 font-medium">{r.parentName}</td>
                <td className="p-3">{r.duration}</td>
                <td className="p-3">{formatLKR(r.baseAmount)}</td>
                <td className="p-3">
                  {r.discount ? `- ${formatLKR(r.discount)}` : "-"}
                </td>
                <td className="p-3">
                  {r.reward ? `- ${formatLKR(r.reward)}` : "-"}
                </td>
                <td className="p-3 font-semibold">
                  {formatLKR(r.finalAmount)}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      r.method === "Cash"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-indigo-50 text-indigo-700"
                    }`}
                  >
                    {r.method}
                  </span>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={8}>
                  No earnings found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer note */}
      <p className="text-xs text-gray-400 mt-3">
        UI uses mock data for now. Next step: connect earnings to completed
        sessions and payment records.
      </p>
    </div>
  );
}
