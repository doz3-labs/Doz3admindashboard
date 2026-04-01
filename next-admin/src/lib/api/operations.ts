export type InventoryBatch = {
  id: string;
  medication_id: string;
  medication_name: string;
  medication_dosage: string;
  medication_form_factor: string;
  batch_number: string;
  expiry_date: string; // ISO date
  current_stock_count: number;
};

export type FulfillmentQueueItem = {
  patient_id: string;
  abha_address: string;
  upcoming_month_start: string;
  upcoming_month_end: string;
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

export type FulfillmentDetail = {
  patient_id: string;
  abha_address: string;
  window_start: string;
  window_end: string;
  lines: FulfillmentLine[];
};

export type PendingPharmacistOrderSummary = {
  order_id: string;
  patient_id: string;
  abha_address: string;
  window_start: string;
  window_end: string;
  status: string;
  lines: FulfillmentLine[];
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:8000";

async function assertOk(res: Response, label: string) {
  if (res.ok) return;
  const text = await res.text().catch(() => "");
  throw new Error(`${label} failed (${res.status}): ${text || res.statusText}`);
}

export async function getInventoryBatches(): Promise<InventoryBatch[]> {
  const res = await fetch(`${API_BASE_URL}/inventory/batches`, { cache: "no-store" });
  await assertOk(res, "GET /inventory/batches");
  return (await res.json()) as InventoryBatch[];
}

export async function getFulfillmentQueue(): Promise<FulfillmentQueueItem[]> {
  const res = await fetch(`${API_BASE_URL}/fulfillment/queue`, { cache: "no-store" });
  await assertOk(res, "GET /fulfillment/queue");
  return (await res.json()) as FulfillmentQueueItem[];
}

export async function getFulfillmentDetails(patientId: string): Promise<FulfillmentDetail> {
  const res = await fetch(`${API_BASE_URL}/fulfillment/${encodeURIComponent(patientId)}/details`, {
    cache: "no-store",
  });
  await assertOk(res, "GET /fulfillment/{patient_id}/details");
  return (await res.json()) as FulfillmentDetail;
}

export async function approveForPrinting(patientId: string, windowStart: string, windowEnd: string) {
  const res = await fetch(
    `${API_BASE_URL}/fulfillment/${encodeURIComponent(patientId)}/approve-for-printing`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ window_start: windowStart, window_end: windowEnd }),
    }
  );
  await assertOk(res, "POST /fulfillment/{patient_id}/approve-for-printing");
  return (await res.json()) as { pouch_roll_id: string; status: string };
}

export async function getPendingPharmacistOrders(): Promise<PendingPharmacistOrderSummary[]> {
  const res = await fetch(`${API_BASE_URL}/admin/orders/pending-pharmacist`, { cache: "no-store" });
  await assertOk(res, "GET /admin/orders/pending-pharmacist");
  return (await res.json()) as PendingPharmacistOrderSummary[];
}

export async function approveOrderForPrinting(orderId: string): Promise<{ order_id: string; pouch_roll_id: string; status: string }> {
  const res = await fetch(`${API_BASE_URL}/admin/orders/${encodeURIComponent(orderId)}/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  await assertOk(res, "POST /admin/orders/{order_id}/approve");
  return (await res.json()) as { order_id: string; pouch_roll_id: string; status: string };
}

export type AdminOrderSummary = {
  order_id: string;
  patient_id: string;
  abha_address: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
};

export type OrderStats = {
  incoming_today: number;
  pending_approval: number;
  approved_for_printing: number;
  qc_completed: number;
  dispatched: number;
  delivered: number;
};

export async function getAllOrders(): Promise<AdminOrderSummary[]> {
  const res = await fetch(`${API_BASE_URL}/admin/orders/all`, { cache: "no-store" });
  await assertOk(res, "GET /admin/orders/all");
  return (await res.json()) as AdminOrderSummary[];
}

export async function getOrderStats(): Promise<OrderStats> {
  const res = await fetch(`${API_BASE_URL}/admin/orders/stats`, { cache: "no-store" });
  await assertOk(res, "GET /admin/orders/stats");
  return (await res.json()) as OrderStats;
}

export async function dispatchOrder(orderId: string, trackingId: string) {
  const res = await fetch(`${API_BASE_URL}/admin/orders/${encodeURIComponent(orderId)}/dispatch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tracking_id: trackingId }),
  });
  await assertOk(res, "POST /admin/orders/{order_id}/dispatch");
  return await res.json();
}

export async function markDelivered(orderId: string) {
  const res = await fetch(`${API_BASE_URL}/admin/orders/${encodeURIComponent(orderId)}/deliver`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  await assertOk(res, "POST /admin/orders/{order_id}/deliver");
  return await res.json();
}

