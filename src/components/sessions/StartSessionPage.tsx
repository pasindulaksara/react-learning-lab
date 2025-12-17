import { useMemo, useState } from "react";

type Child = {
  id: number;
  name: string;
  age: number;
};

type Parent = {
  id: number;
  name: string;
  phone: string;
  children: Child[];
};

// TEMP MOCK DATA – later this comes from your backend API
const MOCK_PARENTS: Parent[] = [
  {
    id: 1,
    name: "Lakshika Perera",
    phone: "0771234567",
    children: [
      { id: 11, name: "Kavindu", age: 6 },
      { id: 12, name: "Sithmi", age: 4 },
    ],
  },
  {
    id: 2,
    name: "Nuwan Silva",
    phone: "0719876543",
    children: [{ id: 21, name: "Dinuka", age: 8 }],
  },
];

const SHOP_OPEN_HOUR = 8;   // 8 AM
const SHOP_CLOSE_HOUR = 20; // 8 PM
const DEFAULT_DURATION_HOURS = 2;

export default function StartSessionPage() {
  const [query, setQuery] = useState("");
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [selectedChildIds, setSelectedChildIds] = useState<number[]>([]);

  const now = useMemo(() => new Date(), []);
  const [startTime] = useState<Date>(now);

  // Simple frontend search
  const filteredParents = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return MOCK_PARENTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.phone.toLowerCase().includes(q)
    );
  }, [query]);

  const toggleChild = (id: number) => {
    setSelectedChildIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  // Calculate planned end time (2h but not after 8 PM)
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

  const handleStartSession = () => {
    if (!selectedParent) {
      alert("Please select a parent first.");
      return;
    }
    if (!selectedChildIds.length) {
      alert("Select at least one child.");
      return;
    }

    const payload = {
      parentId: selectedParent.id,
      childIds: selectedChildIds,
      startTime: startTime.toISOString(),
      plannedEndTime: plannedEnd.toISOString(),
      durationMinutes: effectiveMinutes,
    };

    console.log("Start session payload (mock):", payload);
    alert("Session started (mock). Check console for payload.");
  };

  const durationHours = Math.floor(effectiveMinutes / 60);
  const durationRemainder = effectiveMinutes % 60;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-6 sm:p-8">
        {/* Header */}
        <header className="mb-6 border-b pb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              Start play session
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Search parent, select children and start the 2-hour timer.
            </p>
          </div>
          <div className="text-xs text-right text-slate-500">
            <div>
              Shop hours: {SHOP_OPEN_HOUR.toString().padStart(2, "0")}:00 –{" "}
              {SHOP_CLOSE_HOUR.toString().padStart(2, "0")}:00
            </div>
            <div>
              Now:{" "}
              <span className="font-medium text-slate-800">
                {formatTime(startTime)}
              </span>
            </div>
          </div>
        </header>

        {/* Search */}
        <section className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Search parent (name or WhatsApp number)
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedParent(null);
              setSelectedChildIds([]);
            }}
            className="block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            placeholder="e.g. Lakshika or 0771234567"
          />

          {query.trim() && (
            <div className="mt-3 border rounded-xl border-slate-200 bg-slate-50 max-h-40 overflow-y-auto text-sm">
              {filteredParents.length === 0 && (
                <div className="px-3 py-2 text-slate-500">
                  No matching parents. Use registration page first.
                </div>
              )}
              {filteredParents.map((parent) => (
                <button
                  key={parent.id}
                  type="button"
                  onClick={() => {
                    setSelectedParent(parent);
                    setSelectedChildIds(parent.children.map((c) => c.id)); // default select all
                  }}
                  className={`w-full text-left px-3 py-2 border-b last:border-b-0 transition ${
                    selectedParent?.id === parent.id
                      ? "bg-sky-50 text-sky-800 border-sky-200"
                      : "hover:bg-slate-100"
                  }`}
                >
                  <div className="font-medium">{parent.name}</div>
                  <div className="text-xs text-slate-500">
                    WhatsApp: {parent.phone} · {parent.children.length} child
                    {parent.children.length > 1 ? "ren" : ""}
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Selected parent */}
        {selectedParent && (
          <section className="space-y-6">
            {/* Parent summary */}
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
                {/* later: show total hours and reward info */}
                Loyalty info will appear here.
              </div>
            </div>

            {/* Children selection */}
            <div>
              <h2 className="text-sm font-semibold text-slate-800 mb-2">
                Select children for this session
              </h2>
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
                      />
                    </label>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Discount is always per parent, not per child. Even with 2+ kids,
                only one Rs. 1000 / 1 hour free offer applies.
              </p>
            </div>

            {/* Session time summary */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-800">
                  Session time
                </div>
                <div className="text-xs text-slate-600">
                  Standard: {DEFAULT_DURATION_HOURS} hours · Closes at 8:00 PM.
                  If started close to closing time, end time is capped at 8:00
                  PM.
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
                    {durationHours} h
                    {durationRemainder !== 0 && ` ${durationRemainder} min`}
                  </div>
                </div>
              </div>
            </div>

            {/* Start button */}
            <div className="border-t pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleStartSession}
                className="inline-flex items-center rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Start session
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
