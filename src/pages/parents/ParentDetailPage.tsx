// src/pages/parents/ParentDetailPage.tsx

type Child = {
    id: number;
    name: string;
    age: number;
  };
  
  type Session = {
    id: number;
    date: string; // display-ready
    startTime: string;
    endTime: string;
    durationMinutes: number;
    numChildren: number;
    normalPrice: number;
    discountAmount: number;
    finalPrice: number;
  };
  
  type ParentProfile = {
    id: number;
    name: string;
    phone: string;
    children: Child[];
    totalMinutesPlayed: number;
    totalSessions: number;
    rewardsEarned: number; // how many times 8h completed
    rewardsAvailable: number; // not used yet
    rewardsUsed: number;
    upcomingRewardInMinutes: number; // minutes left to next 8h
    recentSessions: Session[];
  };
  
  // MOCK profile – later replace with API data
  const MOCK_PARENT: ParentProfile = {
    id: 1,
    name: "Lakshika Perera",
    phone: "0771234567",
    children: [
      { id: 1, name: "Kavindu", age: 6 },
      { id: 2, name: "Sithmi", age: 4 },
    ],
    totalMinutesPlayed: 520, // 8h40m
    totalSessions: 5,
    rewardsEarned: 1,
    rewardsAvailable: 1,
    rewardsUsed: 0,
    upcomingRewardInMinutes: 480, // next 8h after this
    recentSessions: [
      {
        id: 101,
        date: "2025-12-05",
        startTime: "15:00",
        endTime: "17:00",
        durationMinutes: 120,
        numChildren: 2,
        normalPrice: 2000,
        discountAmount: 0,
        finalPrice: 2000,
      },
      {
        id: 102,
        date: "2025-12-06",
        startTime: "10:00",
        endTime: "12:00",
        durationMinutes: 120,
        numChildren: 1,
        normalPrice: 2000,
        discountAmount: 1000,
        finalPrice: 1000,
      },
      {
        id: 103,
        date: "2025-12-07",
        startTime: "16:00",
        endTime: "18:00",
        durationMinutes: 120,
        numChildren: 2,
        normalPrice: 2000,
        discountAmount: 0,
        finalPrice: 2000,
      },
    ],
  };
  
  function formatDuration(mins: number) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (m === 0) return `${h} h`;
    return `${h} h ${m} min`;
  }
  
  export default function ParentDetailPage() {
    const parent = MOCK_PARENT;
  
    const totalHoursPlayed = formatDuration(parent.totalMinutesPlayed);
    const nextRewardHours =
      parent.upcomingRewardInMinutes > 0
        ? formatDuration(parent.upcomingRewardInMinutes)
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
              All details for this family in one place: children, sessions,
              offers.
            </p>
          </div>
          <div className="text-right text-sm">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Parent
            </div>
            <div className="font-medium text-slate-900">{parent.name}</div>
            <div className="text-xs text-slate-500">
              WhatsApp: {parent.phone}
            </div>
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
              Across {parent.totalSessions} session
              {parent.totalSessions > 1 ? "s" : ""}.
            </div>
          </div>
  
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
              Rewards
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-semibold text-slate-900">
                {parent.rewardsEarned}
              </span>
              <span className="text-xs text-slate-500">earned</span>
            </div>
            <div className="mt-1 text-xs text-slate-500">
              <span className="font-medium text-emerald-600">
                {parent.rewardsAvailable} available
              </span>{" "}
              · {parent.rewardsUsed} used
            </div>
          </div>
  
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
              Next reward
            </div>
            <div className="text-xl font-semibold text-slate-900">
              {nextRewardHours}
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
                <h2 className="text-sm font-semibold text-slate-900">
                  Children
                </h2>
                <span className="text-xs text-slate-500">
                  {parent.children.length} child
                  {parent.children.length > 1 ? "ren" : ""}
                </span>
              </div>
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
                    <div className="text-xs text-slate-500">
                      Under parent:{" "}
                      <span className="font-medium">{parent.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
  
            {/* Recent sessions */}
            <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-900">
                  Recent sessions
                </h2>
                <span className="text-xs text-slate-500">
                  Showing last {parent.recentSessions.length} sessions
                </span>
              </div>
  
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 border-b border-slate-100">
                      <th className="py-2 pr-3 font-medium">Date</th>
                      <th className="py-2 px-3 font-medium">Time</th>
                      <th className="py-2 px-3 font-medium">Duration</th>
                      <th className="py-2 px-3 font-medium">Children</th>
                      <th className="py-2 px-3 font-medium text-right">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {parent.recentSessions.map((s) => (
                      <tr
                        key={s.id}
                        className="border-b last:border-b-0 border-slate-50"
                      >
                        <td className="py-2.5 pr-3 whitespace-nowrap text-slate-700">
                          {s.date}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-slate-700">
                          {s.startTime} – {s.endTime}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-slate-700">
                          {formatDuration(s.durationMinutes)}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700">
                          {s.numChildren}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                          {s.discountAmount > 0 ? (
                            <div className="flex flex-col items-end">
                              <span className="line-through text-xs text-slate-400">
                                Rs. {s.normalPrice.toLocaleString("en-LK")}
                              </span>
                              <span className="text-sm font-semibold text-emerald-600">
                                Rs. {s.finalPrice.toLocaleString("en-LK")}
                              </span>
                              <span className="text-[0.65rem] text-emerald-500">
                                - Rs. {s.discountAmount.toLocaleString("en-LK")}{" "}
                                offer applied
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm font-semibold text-slate-800">
                              Rs. {s.finalPrice.toLocaleString("en-LK")}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
  
          {/* Right: actions & WhatsApp info */}
          <aside className="space-y-6">
            {/* WhatsApp + quick note */}
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
                  “Hi {parent.name.split(" ")[0]}, your family has unlocked{" "}
                  <strong>Rs. 1000 off / 1 free hour</strong> at Tiny Town Indoor
                  Playground. Show this at the counter on your next visit.”
                </div>
              </div>
            </section>
  
            {/* Quick stats */}
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
  