import { http } from "./http";

export type ChildRow = {
  id: number;
  parent_id: number;
  name: string;
  age: number;
  created_at?: string;
};

export type ParentDetail = {
  id: number;
  name: string;
  phone: string;
  created_at: string;
  children: ChildRow[];
};

export async function getParentById(id: string | number): Promise<ParentDetail> {
  const res = await http.get(`/parents/${id}`);
  return res.data.data as ParentDetail;
}
