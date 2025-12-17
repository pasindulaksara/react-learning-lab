import { useEffect, useState } from "react";

type ActiveSession = {
  id: number;
  parentName: string;
  childNames: string[];
  startTime: string; // ISO
  endTime: string;   // ISO
};

// MOCK data for now – later will come from backend API
const createMockSessions = (): ActiveSession[] => {
  const now = Date.now();

  return [
    {
      id: 1,
      parentName: "Lakshika Perera",
      childNames: ["Kavindu", "Sithmi"],
      startTime: new Date(now - 15 * 60 * 1000).toISOString(), // started 15 mins ago
      endTime: new Date(now + 105 * 60 * 1000).toISOString(),  // 1h45 left
    },
    {
      id: 2,
      parentName: "Nuwan Silva",
      childNames: ["Dinuka"],
      startTime: new Date(now - 60 * 60 * 1000).toISOString(), // started 1h ago
      endTime: new Date(now + 60 * 60 * 1000).toISOString(),   // 1h left
    },
    {
      id: 3,
      parentName: "Tharindu Jayasinghe",
      childNames: ["Mihiru", "Pavani", "Sahan"],
      startTime: new Date(now - 80 * 60 * 1000).toISOString(), // started 1h20 ago
      endTime: new Date(now + 10 * 60 * 1000).toISOString(),   // 10 mins left (RED)
    },
  ];
};

const LAST_MINUTES_WARNING = 15; // minutes

function formatClock(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function formatTimeLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function DisplayBoardPage() {
  const [sessions] = useState<ActiveSession[]>(() => createMockSessions());
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col font-sans">
      {/* Top bar */}
      <header className="px-6 sm:px-10 py-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Kids Play Zone – Live Sessions
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Countdown turns red in the last {LAST_MINUTES_WARNING} minutes.
          </p>
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

      {/* Content */}
      <main className="flex-1 px-4 sm:px-8 py-6 sm:py-8">
        {sessions.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-slate-500 text-lg">
              No active sessions at the moment.
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
            {sessions.map((session) => {
              const endMs = new Date(session.endTime).getTime();
              const remaining = endMs - now;
              const isFinished = remaining <= 0;
              const remainingMinutes = Math.floor(remaining / 60000);
              const isWarning =
                !isFinished && remainingMinutes <= LAST_MINUTES_WARNING;

              const cardBorderClass = isFinished
                ? "border-slate-700"
                : isWarning
                ? "border-red-500/70"
                : "border-slate-700/60";

              const cardBgClass = isWarning
                ? "bg-slate-900/70"
                : "bg-slate-800/80";

              const glowClass = isWarning
                ? "shadow-[0_0_35px_rgba(248,113,113,0.45)]"
                : "shadow-[0_0_28px_rgba(56,189,248,0.22)]";

              return (
                <div
                  key={session.id}
                  className={`relative overflow-hidden rounded-2xl border ${cardBorderClass} ${cardBgClass} ${glowClass} backdrop-blur-sm p-4 sm:p-5 flex flex-col gap-3`}
                >
                  {/* Top: child names */}
                  <div>
                    <div className="text-[0.65rem] uppercase tracking-wide text-slate-400 mb-1">
                      Children
                    </div>
                    <div className="text-lg sm:text-xl font-semibold text-slate-50 truncate">
                      {session.childNames.join(", ")}
                    </div>
                    <div className="text-xs text-slate-400">
                      Parent:{" "}
                      <span className="text-slate-200">
                        {session.parentName}
                      </span>
                    </div>
                  </div>

                  {/* Times */}
                  <div className="grid grid-cols-3 gap-3 text-xs sm:text-sm mt-1">
                    <div>
                      <div className="text-[0.65rem] uppercase tracking-wide text-slate-500">
                        Start
                      </div>
                      <div className="font-mono text-slate-100 text-sm sm:text-base">
                        {formatTimeLabel(session.startTime)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[0.65rem] uppercase tracking-wide text-slate-500">
                        End
                      </div>
                      <div className="font-mono text-slate-100 text-sm sm:text-base">
                        {formatTimeLabel(session.endTime)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[0.65rem] uppercase tracking-wide text-slate-500">
                        Status
                      </div>
                      <div
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[0.7rem] font-medium ${
                          isFinished
                            ? "bg-slate-700 text-slate-300"
                            : "bg-emerald-500/15 text-emerald-300 border border-emerald-400/40"
                        }`}
                      >
                        {isFinished ? "Finished" : "Running"}
                      </div>
                    </div>
                  </div>

                  {/* Countdown */}
                  <div className="mt-3 sm:mt-4">
                    <div className="text-[0.65rem] uppercase tracking-wide text-slate-500 mb-1">
                      Countdown
                    </div>
                    <div
                      className={`font-mono text-2xl sm:text-3xl md:text-4xl leading-tight ${
                        isFinished
                          ? "text-slate-500"
                          : isWarning
                          ? "text-red-400"
                          : "text-sky-300"
                      }`}
                    >
                      {isFinished ? "00:00:00" : formatClock(remaining)}
                    </div>
                    {!isFinished && isWarning && (
                      <div className="mt-1 text-[0.7rem] text-red-400">
                        Less than {LAST_MINUTES_WARNING} minutes remaining.
                      </div>
                    )}
                  </div>

                  {/* Bottom accent bar */}
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
