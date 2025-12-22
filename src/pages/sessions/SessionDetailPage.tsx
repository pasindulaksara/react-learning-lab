import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  endSession,
  getSessionById,
  type SessionRow,
  type SessionStatus,
} from "../../api/sessions";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatHM(sqlOrIso: string) {
  const d = new Date(sqlOrIso.replace(" ", "T")); // handles "YYYY-MM-DD HH:mm:ss"
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function durationMinutes(start: string, end: string | null) {
  const s = new Date(start.replace(" ", "T")).getTime();
  const e = end ? new Date(end.replace(" ", "T")).getTime() : Date.now();
  return Math.max(Math.floor((e - s) / 60000), 0);
}

function durationText(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h <= 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

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
  const navigate = useNavigate();

  const [session, setSession] = useState<SessionRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [ending, setEnding] = useState(false);
  const [error, setError] = useState("");

  // end form
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "bank_transfer">(
    "cash"
  );
  const [applyDiscount, setApplyDiscount] = useState(false);

  useEffect(() => {
    let alive = true;
    const sid = Number(id);
    if (!sid) return;

    setLoading(true);
    setError("");

    getSessionById(sid)
      .then((row) => {
        if (!alive) return;
        setSession(row);
        if (row.payment_method === "bank_transfer") setPaymentMethod("bank_transfer");
        if (row.payment_method === "cash") setPaymentMethod("cash");
      })
      .catch((e: any) => {
        if (!alive) return;
        setSession(null);
        setError(e?.response?.data?.error || "Failed to load session");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [id]);

  // ✅ live duration update every 10s if active (no refresh needed)
  useEffect(() => {
    if (!session) return;
    if (session.status !== "active") return;

    const t = window.setInterval(() => {
      setSession((prev) => (prev ? { ...prev } : prev)); // trigger re-render
    }, 10000);

    return () => window.clearInterval(t);
  }, [session]);

  const derived = useMemo(() => {
    if (!session) return null;

    const mins =
      session.status === "completed" && session.duration_minutes != null
        ? Number(session.duration_minutes)
        : durationMinutes(session.start_time, session.end_time);

    const start = formatHM(session.start_time);
    const end = session.end_time ? formatHM(session.end_time) : "-";

    return {
      start,
      end,
      mins,
      duration: durationText(mins),
    };
  }, [session]);

  const handleEndSession = async () => {
    if (!session) return;
    if (session.status !== "active") return;

    setEnding(true);
    setError("");

    try {
      const res = await endSession(Number(session.id), {
        endTime: new Date().toISOString(),
        paymentMethod,
        applyDiscount,
      });

      // res.data has the updated row (we return getSessionById output)
      const updated = res.data as { ok: boolean; data: SessionRow };
      if (updated?.data) {
        setSession(updated.data);
      }

      // optional: go back
      navigate("/sessions");
    } catch (e: any) {
      setError(e?.response?.data?.error || "Failed to end session");
    } finally {
      setEnding(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6 text-gray-500">
          Loading session…
        </div>
      </div>
    );
  }

  if (!session || !derived) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-xl font-semibold mb-2">Session not found</h1>
          <p className="text-sm text-gray-500 mb-4">
            The session you are looking for does not exist.
          </p>
          <Link to="/sessions" className="text-blue-600 hover:underline">
            Back to Sessions
          </Link>
        </div>
      </div>
    );
  }

  const paymentLabel =
    session.payment_method === "cash"
      ? "Cash"
      : session.payment_method === "bank_transfer"
      ? "Bank transfer"
      : "Pending";

  return (
    <div className="p-6">
      {error && (
        <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 px-4 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">Session Details</h1>
            <StatusBadge status={session.status} />
          </div>
          <p className="text-sm text-gray-500">
            End session, record payment method, apply discount.
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
            disabled={session.status !== "active" || ending}
            onClick={handleEndSession}
          >
            {ending ? "Ending..." : "End session"}
          </button>
        </div>
      </div>

      {/* Top summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Parent</p>
          <p className="text-lg font-semibold">{session.parent_name}</p>
          <p className="text-sm text-gray-500">WhatsApp: {session.parent_phone}</p>
          <p className="text-sm text-gray-500">
            {Number(session.children_count)} child
            {Number(session.children_count) > 1 ? "ren" : ""}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Time</p>
          <p className="text-lg font-semibold">
            {derived.start} <span className="text-gray-400 font-normal">→</span>{" "}
            {derived.end}
          </p>
          <p className="text-sm text-gray-500">Duration: {derived.duration}</p>
          <p className="text-xs text-gray-400 mt-1">
            Planned end: {session.planned_end_time ? formatHM(session.planned_end_time) : "-"}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Payment</p>
          <p className="text-lg font-semibold">
            Rs. {Number(session.final_price).toLocaleString("en-LK")}
          </p>
          <p className="text-sm text-gray-500">Method: {paymentLabel}</p>
          <p className="text-xs text-gray-400 mt-1">
            Duration saved: {session.duration_minutes ?? "-"}
          </p>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Session meta */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-3">Session</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Session ID</div>
              <div className="font-medium">{Number(session.id)}</div>
            </div>

            <div>
              <div className="text-gray-500">Status</div>
              <div className="font-medium capitalize">{session.status}</div>
            </div>

            <div>
              <div className="text-gray-500">Start</div>
              <div className="font-medium break-all">{session.start_time}</div>
            </div>

            <div>
              <div className="text-gray-500">End</div>
              <div className="font-medium break-all">{session.end_time || "-"}</div>
            </div>
          </div>

          {/* End session form */}
          <div className="mt-5 border-t pt-4">
            <h3 className="text-sm font-semibold mb-3">Complete payment</h3>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Method:</span>
                <select
                  className="border rounded px-3 py-2 text-sm"
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value as "cash" | "bank_transfer")
                  }
                  disabled={session.status !== "active"}
                >
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank transfer</option>
                </select>
              </div>

              <label className="inline-flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={applyDiscount}
                  onChange={(e) => setApplyDiscount(e.target.checked)}
                  disabled={session.status !== "active"}
                />
                Apply discount (Rs. 1000)
              </label>
            </div>
          </div>
        </div>

        {/* Payment breakdown */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-3">Payment breakdown</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Normal</span>
              <span>Rs. {Number(session.normal_price).toLocaleString("en-LK")}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Discount</span>
              <span>- Rs. {Number(session.discount_amount).toLocaleString("en-LK")}</span>
            </div>

            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>Rs. {Number(session.final_price).toLocaleString("en-LK")}</span>
            </div>
          </div>

          <div className="mt-4">
            <button className="w-full px-4 py-2 rounded border bg-white hover:bg-gray-50 text-sm">
              Print receipt (UI)
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-3">
            Payment is stored in sessions table (cash / bank_transfer).
          </p>
        </div>
      </div>
    </div>
  );
}
