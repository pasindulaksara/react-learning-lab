// src/api/sessions.ts
import { http } from "./http";

export type SessionStatus = "active" | "completed";

export type SessionRow = {
  id: number;
  parent_id: number;

  parent_name?: string;
  parent_phone?: string;

  status: SessionStatus;
  start_time: string; // "YYYY-MM-DD HH:mm:ss"
  planned_end_time: string | null;
  end_time: string | null;
  children_count: number;

  duration_minutes: number | null;
  payment_method: "cash" | "bank_transfer" | null;
  normal_price: number;
  discount_amount: number;
  final_price: number;
};

export type StartSessionPayload = {
  parent_id: number;
  child_ids: number[];
  planned_minutes?: number; // default 120
  start_time?: string; // ✅ send "YYYY-MM-DD HH:mm:ss" to avoid timezone shift
};

export async function startSession(payload: StartSessionPayload) {
  const res = await http.post("/sessions/start", payload);
  return res.data.data as {
    id: number;
    parent_id: number;
    start_time: string;
    planned_end_time: string;
    status: SessionStatus;
    child_ids: number[];
  };
}

export async function getSessions(params?: { status?: string; range?: string }) {
  const clean: Record<string, string> = {};

  if (params?.status && params.status !== "all") {
    clean.status = params.status;
  }

  const res = await http.get("/sessions", { params: clean });
  return res.data.data as SessionRow[];
}

export async function getSessionById(sessionId: number) {
  const res = await http.get("/sessions");
  const rows = res.data.data as SessionRow[];
  const found = rows.find((s) => Number(s.id) === Number(sessionId));
  if (!found) throw new Error("Session not found");
  return found;
}

export async function endSession(
  sessionId: number,
  payload: { payment_method: "cash" | "bank_transfer" }
) {
  const res = await http.post(`/sessions/${sessionId}/end`, payload);
  return res.data as { ok: boolean; data: SessionRow };
}
