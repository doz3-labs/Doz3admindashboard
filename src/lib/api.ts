const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:8000";

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET ${path} failed (${res.status}): ${text}`);
  }
  return (await res.json()) as T;
}

export async function apiPost<T>(path: string, body: unknown = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`POST ${path} failed (${res.status}): ${text}`);
  }
  return (await res.json()) as T;
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`PATCH ${path} failed (${res.status}): ${text}`);
  }
  return (await res.json()) as T;
}

// ── Typed API helpers for the FastAPI backend ──

export type OrderStats = {
  incoming_today: number;
  pending_approval: number;
  approved_for_printing: number;
  qc_completed: number;
  dispatched: number;
  delivered: number;
};

export type AdminOrder = {
  order_id: string;
  patient_id: string;
  abha_address: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
};

export type FulfillmentLine = {
  medication_id: string;
  medication_name: string;
  medication_dosage: string;
  medication_form_factor: string;
  morning: number;
  noon: number;
  night: number;
};

export type PendingOrder = {
  order_id: string;
  patient_id: string;
  abha_address: string;
  window_start: string;
  window_end: string;
  status: string;
  lines: FulfillmentLine[];
};

export type InventoryBatch = {
  id: string;
  medication_id: string;
  medication_name: string;
  medication_dosage: string;
  medication_form_factor: string;
  batch_number: string;
  expiry_date: string;
  current_stock_count: number;
};

export const getOrderStats = () => apiGet<OrderStats>("/admin/orders/stats");
export const getAllOrders = () => apiGet<AdminOrder[]>("/admin/orders/all");
export const getPendingOrders = () => apiGet<PendingOrder[]>("/admin/orders/pending-pharmacist");
export const approveOrder = (id: string) => apiPost<any>(`/admin/orders/${id}/approve`, {});
export const dispatchOrder = (id: string, trackingId: string) => apiPost<any>(`/admin/orders/${id}/dispatch`, { tracking_id: trackingId });
export const markDelivered = (id: string) => apiPost<any>(`/admin/orders/${id}/deliver`, {});
export const getInventoryBatches = () => apiGet<InventoryBatch[]>("/inventory/batches");
export const receiveInventory = (data: { medication_id: string; batch_number: string; expiry_date: string; received_stock_count: number }) => apiPost<any>("/inventory/receive", data);

