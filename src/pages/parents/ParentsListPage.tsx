import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getParents, type ParentRow } from "../../api/parents";

export default function ParentsListPage() {
  const [rows, setRows] = useState<ParentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const controller = new AbortController();
  
    (async () => {
      try {
        const data = await getParents();
        setRows(data);
        setError("");
      } catch (e: any) {
        // If request was aborted, ignore
        if (e?.name === "CanceledError" || e?.name === "AbortError") return;
        setError(e?.message || "Failed to load parents");
      } finally {
        setLoading(false);
      }
    })();
  
    return () => controller.abort();
  }, []);
  

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (p) => p.name.toLowerCase().includes(q) || p.phone.toLowerCase().includes(q)
    );
  }, [rows, query]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
            All parents
          </h1>
          <p className="text-sm text-slate-500">
            List of all registered parents. Click a parent to view full profile.
          </p>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-2">
          <div className="text-xs text-slate-500">
            Total parents:{" "}
            <span className="font-semibold text-slate-800">
              {loading ? "…" : rows.length}
            </span>
          </div>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or WhatsApp…"
            className="w-full sm:w-64 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
      </header>

      <section className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
        <div className="hidden sm:grid grid-cols-[2fr_1.4fr_auto] gap-4 px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-500 uppercase tracking-wide">
          <div>Parent name</div>
          <div>WhatsApp</div>
          <div className="text-right pr-1">Actions</div>
        </div>

        <div className="divide-y divide-slate-100">
          {loading && (
            <div className="px-4 py-6 text-center text-sm text-slate-500">
              Loading parents...
            </div>
          )}

          {!loading && error && (
            <div className="px-4 py-6 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            filtered.map((p) => (
              <div
                key={p.id}
                className="px-4 py-3 flex flex-col sm:grid sm:grid-cols-[2fr_1.4fr_auto] sm:items-center gap-1 sm:gap-4 hover:bg-slate-50 transition"
              >
                <div>
                  <div className="text-sm font-medium text-slate-900">
                    {p.name}
                  </div>
                  <div className="text-xs text-slate-500 sm:hidden">
                    WhatsApp: {p.phone}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Children: {p.children_count}
                  </div>
                </div>

                <div className="hidden sm:block text-sm text-slate-700">
                  {p.phone}
                </div>

                <div className="flex justify-between sm:justify-end items-center gap-2 mt-1 sm:mt-0">
                  <Link
                    to={`/parent/${p.id}`}
                    className="inline-flex items-center rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-sky-600"
                  >
                    View profile
                  </Link>
                </div>
              </div>
            ))}

          {!loading && !error && filtered.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-slate-500">
              No parents found. Use Registration page to add a new parent.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
