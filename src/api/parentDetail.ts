import { http } from "./http";

export type ChildRow = {
  id: string;          // backend sends string ids
  parent_id: string;
  name: string;
  age: string;         // backend sends age as string
};

export type RecentSessionRow = {
  id: string;
  parent_id: string;
  start_time: string;
  planned_end_time: string;
  end_time: string | null;
  status: string;
  payment_method: string | null;
  duration_minutes: string;
  normal_price: string;
  discount_amount: string;
  final_price: string;
  children_count: string;
};

export type ParentDetail = {
  id: string;
  name: string;
  phone: string;
  created_at: string;

  children: ChildRow[];

  // ✅ metrics now coming from backend
  total_minutes_played: number;
  total_sessions: number;

  rewards_earned: number;
  rewards_used: number;
  rewards_available: number;

  upcoming_reward_in_minutes: number;

  recent_sessions: RecentSessionRow[];
};

export async function getParentById(id: string | number): Promise<ParentDetail> {
  const res = await http.get(`/parents/${id}`);
  return res.data.data as ParentDetail;
}
