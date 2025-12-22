import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getParentById, type ParentDetail } from "../../api/parentDetail";

function formatDuration(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h <= 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

export default function ParentDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [parent, setParent] = useState<ParentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError("");

        if (!id) {
          setError("Invalid parent id");
          return;
        }

        const data = await getParentById(id);
        if (!alive) return;

        setParent(data);
      } catch (e: unknown) {
        const msg =
          e instanceof Error ? e.message : "Failed to load parent profile";
        if (!alive) return;
        setError(msg);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  // Placeholder metrics until sessions API is implemented
  const metrics = useMemo(() => {
    return {
      totalMinutesPlayed: 0,
      totalSessions: 0,
      rewardsEarned: 0,
      rewardsAvailable: 0,
      rewardsUsed: 0,
      upcomingRewardInMinutes: 8 * 60, // “next reward at 8h”
      recentSessions: [] as Array<{
        id: number;
        date: string;
        startTime: string;
        endTime: string;
        durationMinutes: number;
        numChildren: number;
        normalPrice: number;
        discountAmount: number;
        finalPrice: number;
      }>,
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="text-sm text-slate-500">Loading parent profile…</div>
      </div>
    );
  }

  if (error || !parent) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-4">
          <div className="text-sm font-medium text-slate-900">
            Unable to load profile
          </div>
          <div className="text-sm text-red-600 mt-1">{error || "Not found"}</div>
          <Link
            to="/parents"
            className="inline-flex mt-3 text-sm text-sky-600 hover:text-sky-700"
          >
            ← Back to parents
          </Link>
        </div>
      </div>
    );
  }

  const firstName = parent.name.split(" ")[0] || parent.name;

  const totalHoursPlayed = formatDuration(metrics.totalMinutesPlayed);
  const nextRewardText =
    metrics.upcomingRewardInMinutes > 0
      ? formatDuration(metrics.upcomingRewardInMinutes)
      : "Reward ready";

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
            Parent profile
          </h1>
          <p className="text-sm text-slate-500">
            All details for this family in one place: children, sessions, offers.
          </p>
          <Link
            to="/parents"
            className="inline-flex mt-2 text-sm text-sky-600 hover:text-sky-700"
          >
            ← Back to parents
          </Link>
        </div>

        <div className="text-right text-sm">
          <div className="text-xs uppercase tracking-wide text-slate-500">
            Parent
          </div>
          <div className="font-medium text-slate-900">{parent.name}</div>
          <div className="text-xs text-slate-500">WhatsApp: {parent.phone}</div>
        </div>
      </div>

      {/* Top summary cards */}
      <div className="grid gap-4 sm:gap-5 sm:grid-cols-3 mb-6">
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-4">
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
            Total playtime
          </div>
          <div className="text-xl font-semibold text-slate-900">
            {totalHoursPlayed}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Across {metrics.totalSessions} session
            {metrics.totalSessions === 1 ? "" : "s"}.
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-4">
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
            Rewards
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-semibold text-slate-900">
              {metrics.rewardsEarned}
            </span>
            <span className="text-xs text-slate-500">earned</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            <span className="font-medium text-emerald-600">
              {metrics.rewardsAvailable} available
            </span>{" "}
            · {metrics.rewardsUsed} used
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-4">
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
            Next reward
          </div>
          <div className="text-xl font-semibold text-slate-900">
            {nextRewardText}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            After every 8 hours of playtime, family gets{" "}
            <span className="font-medium">Rs. 1000 off / 1 free hour.</span>
          </div>
        </div>
      </div>

      {/* Main two-column area */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_minmax(0,1fr)]">
        {/* Left: children + sessions */}
        <div className="space-y-6">
          {/* Children list */}
          <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-900">Children</h2>
              <span className="text-xs text-slate-500">
                {parent.children.length} child
                {parent.children.length === 1 ? "" : "ren"}
              </span>
            </div>

            {parent.children.length === 0 ? (
              <div className="text-sm text-slate-500">No children found.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {parent.children.map((child) => (
                  <div
                    key={child.id}
                    className="py-2.5 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {child.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        Age: {child.age}
                      </div>
                    </div>

                    {/* Next step: Start Session button */}
                    <Link
                      to={`/start-session?parent=${parent.id}&child=${child.id}`}
                      className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Start session
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent sessions (placeholder) */}
          <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-900">
                Recent sessions
              </h2>
              <span className="text-xs text-slate-500">Showing last 0 sessions</span>
            </div>

            <div className="text-sm text-slate-500">
              Sessions will appear here once we connect the sessions API.
            </div>
          </section>
        </div>

        {/* Right: WhatsApp info + quick stats */}
        <aside className="space-y-6">
          <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-2">
              WhatsApp & offers
            </h2>
            <p className="text-xs text-slate-600 mb-3">
              This family will automatically receive WhatsApp updates when
              sessions start/end and when rewards are unlocked.
            </p>

            <div className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <div className="text-slate-500 mb-1">Next reward message:</div>
              <div className="text-slate-800">
                “Hi {firstName}, your family has unlocked{" "}
                <strong>Rs. 1000 off / 1 free hour</strong> at Tiny Town Indoor
                Playground. Show this at the counter on your next visit.”
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-2">
              Quick stats
            </h2>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                • Discount is always per parent, not per child – max{" "}
                <strong>Rs. 1000</strong> per visit.
              </li>
              <li>• Minimum session: 1 hour · Standard: 2 hours.</li>
              <li>• Shop hours: 8:00 AM – 8:00 PM.</li>
              <li>
                • System tracks total minutes and rewards automatically; staff
                only start sessions and collect payment.
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
