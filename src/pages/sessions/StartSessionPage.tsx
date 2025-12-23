import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { startSession } from "../../api/sessions";
import { getParents, type ParentRow } from "../../api/parents";
import { getParentById, type ParentDetail } from "../../api/parentDetail";

type Child = {
  id: number;
  name: string;
  age: number;
};

type ParentPicked = {
  id: number;
  name: string;
  phone: string;
  children: Child[];
};

const SHOP_OPEN_HOUR = 8; // 8 AM
const SHOP_CLOSE_HOUR = 20; // 8 PM
const DEFAULT_DURATION_HOURS = 2;

function formatDuration(mins: number) {
  const safe = Number.isFinite(mins) ? mins : 0;
  const h = Math.floor(safe / 60);
  const m = safe % 60;
  if (h <= 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

export default function StartSessionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Deep-link support: /start-session?parent=5&child=7
  const parentFromUrl = searchParams.get("parent");
  const childFromUrl = searchParams.get("child");

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ParentRow[]>([]);
  const [searching, setSearching] = useState(false);

  const [selectedParent, setSelectedParent] = useState<ParentPicked | null>(null);
  const [selectedChildIds, setSelectedChildIds] = useState<number[]>([]);

  const [loadingParent, setLoadingParent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  // IMPORTANT: do NOT memoize "now" once. Use real time when page loads.
  const [startTime] = useState<Date>(() => new Date());

  // planned end time (2h but not after 8 PM)
  const { plannedEnd, effectiveMinutes } = useMemo(() => {
    const start = startTime;

    const planned = new Date(start);
    planned.setHours(start.getHours() + DEFAULT_DURATION_HOURS);

    const closing = new Date(start);
    closing.setHours(SHOP_CLOSE_HOUR, 0, 0, 0);

    const finalEnd = planned > closing ? closing : planned;
    const durationMs = finalEnd.getTime() - start.getTime();
    const durationMinutes = Math.max(Math.round(durationMs / 60000), 0);

    return { plannedEnd: finalEnd, effectiveMinutes: durationMinutes };
  }, [startTime]);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const toggleChild = (id: number) => {
    setSelectedChildIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handlePickParent = async (p: ParentRow) => {
    setError("");
    setLoadingParent(true);

    try {
      const detail: ParentDetail = await getParentById(p.id);

      const children: Child[] = (detail.children || []).map((c) => ({
        id: Number(c.id),
        name: c.name,
        age: Number(c.age || 0),
      }));

      const picked: ParentPicked = {
        id: Number(detail.id),
        name: detail.name,
        phone: detail.phone,
        children,
      };

      setSelectedParent(picked);
      setSelectedChildIds(children.map((c) => c.id)); // default select all
    } catch (e: any) {
      setSelectedParent(null);
      setSelectedChildIds([]);
      setError(e?.response?.data?.error || "Failed to load parent details");
    } finally {
      setLoadingParent(false);
    }
  };

  // Live search (debounced)
  useEffect(() => {
    let alive = true;
    const q = query.trim();

    // Only reset when user is manually searching (not deep-linked)
    if (!parentFromUrl) {
      setSelectedParent(null);
      setSelectedChildIds([]);
    }

    setError("");

    if (!q) {
      setSuggestions([]);
      return;
    }

    setSearching(true);

    const t = window.setTimeout(() => {
      getParents(q)
        .then((rows) => {
          if (!alive) return;
          setSuggestions(Array.isArray(rows) ? rows : []);
        })
        .catch(() => {
          if (!alive) return;
          setSuggestions([]);
        })
        .finally(() => {
          if (!alive) return;
          setSearching(false);
        });
    }, 250);

    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, [query, parentFromUrl]);

  // Auto-load parent + child from URL (when coming from Parent Detail "Start session")
  useEffect(() => {
    let alive = true;

    async function loadFromUrl() {
      if (!parentFromUrl) return;

      try {
        setLoadingParent(true);
        setError("");

        const detail = await getParentById(parentFromUrl);
        if (!alive) return;

        const children: Child[] = (detail.children || []).map((c) => ({
          id: Number(c.id),
          name: c.name,
          age: Number(c.age || 0),
        }));

        const picked: ParentPicked = {
          id: Number(detail.id),
          name: detail.name,
          phone: detail.phone,
          children,
        };

        setSelectedParent(picked);

        if (childFromUrl) {
          setSelectedChildIds([Number(childFromUrl)]);
        } else {
          setSelectedChildIds(children.map((c) => c.id));
        }

        setQuery(detail.name);
        setSuggestions([]);
      } catch (e: any) {
        setSelectedParent(null);
        setSelectedChildIds([]);
        setError(e?.response?.data?.error || "Failed to load parent from link");
      } finally {
        setLoadingParent(false);
      }
    }

    loadFromUrl();

    return () => {
      alive = false;
    };
  }, [parentFromUrl, childFromUrl]);

  const handleStartSession = async () => {
    setError("");

    if (!selectedParent) {
      setError("Please select a parent first.");
      return;
    }
    if (!selectedChildIds.length) {
      setError("Select at least one child.");
      return;
    }

    try {
      setSubmitting(true);

      // Backend expects: parent_id, child_ids, planned_minutes
      await startSession({
        parent_id: Number(selectedParent.id),
        child_ids: selectedChildIds.map(Number),
        planned_minutes: effectiveMinutes > 0 ? effectiveMinutes : 120,
      });

      navigate("/sessions");
    } catch (e: any) {
      setError(e?.response?.data?.error || "Failed to start session");
    } finally {
      setSubmitting(false);
    }
  };

  const durationHours = Math.floor(effectiveMinutes / 60);
  const durationRemainder = effectiveMinutes % 60;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-6 sm:p-8">
        <header className="mb-6 border-b pb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              Start play session
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Search parent, select children and start the timer.
            </p>
          </div>

          <div className="text-xs text-right text-slate-500">
            <div>
              Shop hours: {String(SHOP_OPEN_HOUR).padStart(2, "0")}:00 –{" "}
              {String(SHOP_CLOSE_HOUR).padStart(2, "0")}:00
            </div>
            <div>
              Now:{" "}
              <span className="font-medium text-slate-800">
                {formatTime(startTime)}
              </span>
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 px-4 py-2 text-sm text-rose-700">
            {error}
          </div>
        )}

        <section className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Search parent (name or WhatsApp number)
          </label>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            placeholder="e.g. Lakshika or 0771234567"
            disabled={!!parentFromUrl}
          />

          {query.trim() && !parentFromUrl && (
            <div className="mt-3 border rounded-xl border-slate-200 bg-slate-50 max-h-48 overflow-y-auto text-sm">
              {searching && (
                <div className="px-3 py-2 text-slate-500">Searching…</div>
              )}

              {!searching && suggestions.length === 0 && (
                <div className="px-3 py-2 text-slate-500">
                  No matching parents. Use registration first.
                </div>
              )}

              {!searching &&
                suggestions.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handlePickParent(p)}
                    className="w-full text-left px-3 py-2 border-b last:border-b-0 hover:bg-slate-100 transition"
                    disabled={loadingParent}
                  >
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-slate-500">
                      WhatsApp: {p.phone} · Children: {p.children_count}
                    </div>
                  </button>
                ))}
            </div>
          )}
        </section>

        {loadingParent && (
          <div className="mb-4 text-sm text-slate-500">Loading parent…</div>
        )}

        {selectedParent && (
          <section className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="text-xs text-slate-500">Selected parent</div>
                <div className="text-base font-semibold text-slate-900">
                  {selectedParent.name}
                </div>
                <div className="text-xs text-slate-500">
                  WhatsApp: {selectedParent.phone}
                </div>
              </div>
              <div className="text-xs text-right text-slate-500">
                Loyalty info will appear here.
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-800 mb-2">
                Select children for this session
              </h2>

              {selectedParent.children.length === 0 ? (
                <div className="text-sm text-slate-500">
                  No children found for this parent.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {selectedParent.children.map((child) => {
                    const checked = selectedChildIds.includes(child.id);
                    return (
                      <label
                        key={child.id}
                        className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm cursor-pointer transition
                          ${
                            checked
                              ? "border-sky-500 bg-sky-50"
                              : "border-slate-200 bg-white hover:bg-slate-50"
                          }`}
                      >
                        <div>
                          <div className="font-medium">{child.name}</div>
                          <div className="text-xs text-slate-500">
                            Age: {child.age}
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleChild(child.id)}
                          className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                          disabled={submitting}
                        />
                      </label>
                    );
                  })}
                </div>
              )}

              <p className="mt-2 text-xs text-slate-500">
                Discount is per parent (not per child). Max Rs. 1000 per visit.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-800">
                  Session time
                </div>
                <div className="text-xs text-slate-600">
                  Standard: {DEFAULT_DURATION_HOURS} hours · Closes at 8:00 PM.
                  End time is capped at 8:00 PM.
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div>
                  <span className="text-xs text-slate-500">Start</span>
                  <div className="font-medium text-slate-900">
                    {formatTime(startTime)}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Planned end</span>
                  <div className="font-medium text-slate-900">
                    {formatTime(plannedEnd)}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Duration</span>
                  <div className="font-medium text-slate-900">
                    {durationHours} h{durationRemainder !== 0 ? ` ${durationRemainder} min` : ""}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleStartSession}
                disabled={
                  submitting ||
                  loadingParent ||
                  !selectedParent ||
                  selectedChildIds.length === 0
                }
                className={`inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${
                    submitting
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-500"
                  }`}
              >
                {submitting ? "Starting..." : "Start session"}
              </button>
            </div>

            {/* (Optional) debug line */}
            <div className="text-xs text-slate-400">
              Payload uses parent_id + child_ids + planned_minutes. Backend sets start_time.
              Planned minutes: {formatDuration(effectiveMinutes || 120)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
