import { http } from "./http";

export type ParentRow = {
  id: string;
  name: string;
  phone: string;
  created_at: string;
  children_count: string;
};

export async function getParents(q = "") {
  const res = await http.get("/parents", {
    params: q ? { q } : {},
  });
  return res.data.data as ParentRow[];
}

export async function createParent(payload: {
  name: string;
  phone: string;
  children: { name: string; age?: number }[];
}) {
  const res = await http.post("/parents", payload);
  return res.data;
}

