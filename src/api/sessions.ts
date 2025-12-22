import { http } from "./http";

export type SessionStatus = "active" | "completed";

export type StartSessionPayload = {
  parentId: number;
  childIds: number[];
  startTime?: string;
};

export type SessionRow = {
  id: string | number;
  parent_id: string | number;
  parent_name: string;
  parent_phone: string;
  status: SessionStatus;
  start_time: string;
  planned_end_time: string | null;
  end_time: string | null;
  children_count: string | number;

  // ✅ add these (coming from backend now)
  duration_minutes: number | null;
  payment_method: "cash" | "bank_transfer" | null;
  normal_price: number;
  discount_amount: number;
  final_price: number;
};

export async function startSession(payload: StartSessionPayload) {
  const res = await http.post("/sessions/start", payload);
  return res.data.data as {
    id: number;
    parent_id: number;
    status: string;
    start_time: string;
    planned_end_time: string;
    child_ids: number[];
  };
}

export async function getSessions(params?: { status?: string; range?: string }) {
  const res = await http.get("/sessions", { params });
  return res.data.data as SessionRow[];
}

// ✅ NEW: session detail
export async function getSessionById(sessionId: number) {
  const res = await http.get(`/sessions/${sessionId}`);
  return res.data.data as SessionRow;
}

export async function endSession(
  sessionId: number,
  payload?: { endTime?: string; paymentMethod: "cash" | "bank_transfer"; applyDiscount?: boolean }
) {
  const res = await http.post(`/sessions/${sessionId}/end`, payload || {});
  return res.data;
}
