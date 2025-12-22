import { useEffect, useMemo, useState } from "react";
import { getSessions, type SessionRow } from "../../api/sessions";

type BoardSession = {
  id: number;
  parentName: string;
  childrenCount: number;
  startTime: string;
  endTime: string; // planned_end_time
};

const LAST_MINUTES_WARNING = 15;
const POLL_MS = 10_000; // ✅ 10s (change to 30_000 if you want)

function formatClock(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function formatTimeLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function DisplayBoardPage() {
  const [rows, setRows] = useState<SessionRow[]>([]);
  const [now, setNow] = useState(Date.now());
  const [error, setError] = useState("");

  // ✅ live countdown tick
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // ✅ polling loader (this is what makes new sessions appear)
  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        setError("");
        const data = await getSessions({ status: "active", range: "today" });
        if (!alive) return;

        // ✅ IMPORTANT: always set NEW array reference
        setRows(Array.isArray(data) ? [...data] : []);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.response?.data?.error || "Failed to load sessions");
      }
    };

    // initial load immediately
    load();

    // poll every X seconds
    const pollId = window.setInterval(load, POLL_MS);

    // also refresh when tab becomes active again
    const onVisibility = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      alive = false;
      window.clearInterval(pollId);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const sessions: BoardSession[] = useMemo(() => {
    return rows
      .filter((r) => r.status === "active" && !!r.planned_end_time)
      .map((r) => ({
        id: Number(r.id),
        parentName: r.parent_name,
        childrenCount: Number(r.children_count),
        startTime: r.start_time,
        endTime: r.planned_end_time as string,
      }))
      .sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime());
  }, [rows]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col font-sans">
      <header className="px-6 sm:px-10 py-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Kids Play Zone – Live Sessions
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Updates every {Math.round(POLL_MS / 1000)}s. Countdown turns red in the last{" "}
            {LAST_MINUTES_WARNING} minutes.
          </p>
          {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
        </div>

        <div className="text-right text-xs sm:text-sm text-slate-300">
          <div className="uppercase tracking-wide text-slate-500 text-[0.65rem]">
            Current time
          </div>
          <div className="font-mono text-sm sm:text-base">
            {new Date(now).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-8 py-6 sm:py-8">
        {sessions.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-slate-500 text-lg">
              No active sessions at the moment.
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
            {sessions.map((s) => {
              const endMs = new Date(s.endTime).getTime();
              const remaining = endMs - now;
              const isFinished = remaining <= 0;
              const remainingMinutes = Math.floor(remaining / 60000);
              const isWarning = !isFinished && remainingMinutes <= LAST_MINUTES_WARNING;

              return (
                <div
                  key={s.id}
                  className={`relative overflow-hidden rounded-2xl border ${
                    isWarning ? "border-red-500/70" : "border-slate-700/60"
                  } ${isWarning ? "bg-slate-900/70" : "bg-slate-800/80"} shadow-[0_0_28px_rgba(56,189,248,0.22)]
                  backdrop-blur-sm p-4 sm:p-5 flex flex-col gap-3`}
                >
                  <div>
                    <div className="text-[0.65rem] uppercase tracking-wide text-slate-400 mb-1">
                      Parent
                    </div>
                    <div className="text-lg sm:text-xl font-semibold text-slate-50 truncate">
                      {s.parentName}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Children: <span className="text-slate-200">{s.childrenCount}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm mt-1">
                    <div>
                      <div className="text-[0.65rem] uppercase tracking-wide text-slate-500">Start</div>
                      <div className="font-mono text-slate-100 text-sm sm:text-base">
                        {formatTimeLabel(s.startTime)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[0.65rem] uppercase tracking-wide text-slate-500">End</div>
                      <div className="font-mono text-slate-100 text-sm sm:text-base">
                        {formatTimeLabel(s.endTime)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4">
                    <div className="text-[0.65rem] uppercase tracking-wide text-slate-500 mb-1">
                      Countdown
                    </div>
                    <div
                      className={`font-mono text-2xl sm:text-3xl md:text-4xl leading-tight ${
                        isFinished ? "text-slate-500" : isWarning ? "text-red-400" : "text-sky-300"
                      }`}
                    >
                      {isFinished ? "00:00:00" : formatClock(remaining)}
                    </div>
                  </div>

                  {!isFinished && (
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-1 ${
                        isWarning
                          ? "bg-gradient-to-r from-red-500 via-orange-400 to-red-500"
                          : "bg-gradient-to-r from-sky-500 via-cyan-400 to-sky-500"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
