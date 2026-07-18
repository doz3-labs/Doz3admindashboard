import { getJson, postJson } from "./client";

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

export async function getInventoryBatches(): Promise<InventoryBatch[]> {
  return getJson<InventoryBatch[]>("/inventory/batches", "GET /inventory/batches");
}

export async function getFulfillmentQueue(): Promise<FulfillmentQueueItem[]> {
  return getJson<FulfillmentQueueItem[]>("/fulfillment/queue", "GET /fulfillment/queue");
}

export async function getFulfillmentDetails(patientId: string): Promise<FulfillmentDetail> {
  return getJson<FulfillmentDetail>(
    `/fulfillment/${encodeURIComponent(patientId)}/details`,
    "GET /fulfillment/{patient_id}/details"
  );
}

export async function approveForPrinting(patientId: string, windowStart: string, windowEnd: string) {
  return postJson<{ pouch_roll_id: string; status: string }>(
    `/fulfillment/${encodeURIComponent(patientId)}/approve-for-printing`,
    { window_start: windowStart, window_end: windowEnd },
    "POST /fulfillment/{patient_id}/approve-for-printing"
  );
}

export async function getPendingPharmacistOrders(): Promise<PendingPharmacistOrderSummary[]> {
  return getJson<PendingPharmacistOrderSummary[]>(
    "/admin/orders/pending-pharmacist",
    "GET /admin/orders/pending-pharmacist"
  );
}

export async function approveOrderForPrinting(
  orderId: string
): Promise<{ order_id: string; pouch_roll_id: string; status: string }> {
  return postJson<{ order_id: string; pouch_roll_id: string; status: string }>(
    `/admin/orders/${encodeURIComponent(orderId)}/approve`,
    {},
    "POST /admin/orders/{order_id}/approve"
  );
}

export type QrScanResult = {
  order_id: string;
  status: string;
};

/**
 * Packaging QC: the scan that moves an order from ApprovedForPrinting to
 * PackagingQCCompleted. The backend records a PackagingQCScan row, so this is
 * the auditable checkpoint between printing a roll and dispatching it.
 */
export async function qrScanOrder(orderId: string, qrPayload: string): Promise<QrScanResult> {
  return postJson<QrScanResult>(
    `/packaging/orders/${encodeURIComponent(orderId)}/qr-scan`,
    { qr_payload: qrPayload },
    "POST /packaging/orders/{order_id}/qr-scan",
  );
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
  return getJson<AdminOrderSummary[]>("/admin/orders/all", "GET /admin/orders/all");
}

export async function getOrderStats(): Promise<OrderStats> {
  return getJson<OrderStats>("/admin/orders/stats", "GET /admin/orders/stats");
}

export async function dispatchOrder(orderId: string, trackingId: string) {
  return postJson<unknown>(
    `/admin/orders/${encodeURIComponent(orderId)}/dispatch`,
    { tracking_id: trackingId },
    "POST /admin/orders/{order_id}/dispatch"
  );
}

export async function markDelivered(orderId: string) {
  return postJson<unknown>(
    `/admin/orders/${encodeURIComponent(orderId)}/deliver`,
    {},
    "POST /admin/orders/{order_id}/deliver"
  );
}

