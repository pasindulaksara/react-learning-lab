import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createParent } from "../../api/parents";

type Child = {
  id: number;
  name: string;
  age: string;
};

const MAX_CHILDREN = 6;

export default function RegisterParentPage() {
  const navigate = useNavigate();

  const [parentName, setParentName] = useState("");
  const [phone, setPhone] = useState("");
  const [children, setChildren] = useState<Child[]>([{ id: 1, name: "", age: "" }]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const handleAddChild = () => {
    if (children.length >= MAX_CHILDREN) return;
    const nextId =
      children.length > 0 ? Math.max(...children.map((c) => c.id)) + 1 : 1;
    setChildren([...children, { id: nextId, name: "", age: "" }]);
  };

  const handleRemoveChild = (id: number) => {
    const updated = children.filter((c) => c.id !== id);
    setChildren(updated.length ? updated : [{ id: 1, name: "", age: "" }]);
  };

  const handleChildChange = (id: number, field: "name" | "age", value: string) => {
    setChildren((prev) =>
      prev.map((child) => (child.id === id ? { ...child, [field]: value } : child))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const payload = {
      name: parentName.trim(),
      phone: phone.trim(),
      children: children
        .filter((c) => c.name.trim().length > 0) // require child name
        .map((c) => ({
          name: c.name.trim(),
          age: c.age ? Number(c.age) : undefined,
        })),
    };

    // frontend validation (quick + clear)
    if (!payload.name) return setError("Parent name is required");
    if (!payload.phone) return setError("WhatsApp number is required");
    if (payload.children.length === 0) return setError("Add at least one child");

    try {
      setSubmitting(true);
      await createParent(payload);

      // redirect to parents list after success
      navigate("/parents");
    } catch (err: any) {
      // backend returns { error: "..." }
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to save registration";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const canAddMoreChildren = children.length < MAX_CHILDREN;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-6 sm:p-8">
        <header className="mb-6 border-b pb-4">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
            Kids Play Zone – Registration
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Register parent and children before starting a play session.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Error */}
          {error && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-2 text-sm text-rose-700">
              {error}
            </div>
          )}

          {/* Parent details */}
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Parent details
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="parentName"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Parent name
                </label>
                <input
                  id="parentName"
                  type="text"
                  required
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="e.g. Lakshika Perera"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  WhatsApp number
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="e.g. 0771234567"
                />
                <p className="mt-1 text-xs text-slate-500">
                  This number will be used for automated WhatsApp updates.
                </p>
              </div>
            </div>
          </section>

          {/* Children details */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-slate-800">
                Children (up to 6)
              </h2>
              <button
                type="button"
                onClick={handleAddChild}
                disabled={!canAddMoreChildren || submitting}
                className={`inline-flex items-center rounded-lg border px-3 py-1.5 text-xs sm:text-sm font-medium transition
                  ${
                    canAddMoreChildren && !submitting
                      ? "border-sky-500 text-sky-600 hover:bg-sky-50"
                      : "border-slate-300 text-slate-400 cursor-not-allowed"
                  }`}
              >
                + Add child
              </button>
            </div>

            <div className="space-y-3">
              {children.map((child, index) => (
                <div
                  key={child.id}
                  className="grid gap-3 sm:grid-cols-[minmax(0,3fr)_minmax(0,1fr)_auto] items-end bg-slate-50 border border-slate-200 rounded-xl px-3 py-3"
                >
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Child {index + 1} name
                    </label>
                    <input
                      type="text"
                      value={child.name}
                      onChange={(e) =>
                        handleChildChange(child.id, "name", e.target.value)
                      }
                      className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      placeholder="e.g. Kavindu"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={18}
                      value={child.age}
                      onChange={(e) =>
                        handleChildChange(child.id, "age", e.target.value)
                      }
                      className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      placeholder="e.g. 6"
                      disabled={submitting}
                    />
                  </div>

                  <div className="flex sm:justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveChild(child.id)}
                      disabled={submitting}
                      className="mt-4 sm:mt-0 inline-flex items-center rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-2 text-xs text-slate-500">
              You can add up to 6 children under one parent profile. Discount is
              always per parent, not per child.
            </p>
          </section>

          {/* Submit */}
          <div className="border-t pt-4 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2
                ${
                  submitting
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-sky-500 hover:bg-sky-600 focus:ring-sky-500"
                }`}
            >
              {submitting ? "Saving..." : "Save registration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
