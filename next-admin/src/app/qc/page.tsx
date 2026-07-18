"use client";

import { useCallback, useEffect, useState } from "react";

import { getAllOrders, qrScanOrder, type AdminOrderSummary } from "@/lib/api/operations";
import { ApiError } from "@/lib/api/client";

/**
 * Packaging QC.
 *
 * The checkpoint between a printed pouch roll and dispatch: scan the roll's QR
 * and the order moves ApprovedForPrinting -> PackagingQCCompleted, recording a
 * PackagingQCScan row server-side.
 *
 * Ported from the mock admin's QCStation, which had no backend behind it — it
 * approved and rejected against hardcoded orders and a fake photo review. Only
 * the scan step exists server-side, so only the scan step is built here.
 */

/** Orders waiting on QC. Anything earlier has not been printed yet. */
const AWAITING_QC = "ApprovedForPrinting";

type ScanOutcome = { kind: "ok"; status: string } | { kind: "error"; message: string };

export default function QcPage() {
  const [orders, setOrders] = useState<AdminOrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [qrPayload, setQrPayload] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [outcome, setOutcome] = useState<Record<string, ScanOutcome>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setOrders(await getAllOrders());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const awaiting = orders.filter((o) => o.status === AWAITING_QC);
  const completed = orders.filter((o) => o.status === "PackagingQCCompleted");

  async function submitScan(orderId: string) {
    const payload = qrPayload.trim();
    if (!payload) return;
    setSubmitting(true);
    try {
      const res = await qrScanOrder(orderId, payload);
      setOutcome((prev) => ({ ...prev, [orderId]: { kind: "ok", status: res.status } }));
      setActiveOrderId(null);
      setQrPayload("");
      await load();
    } catch (e) {
      // A 403 here means a valid token without the right role — surfaced as-is
      // rather than treated as a scan failure.
      const message =
        e instanceof ApiError && e.status === 403
          ? "Not authorized to record a QC scan. Pharmacist or admin role required."
          : e instanceof Error
            ? e.message
            : "Scan failed";
      setOutcome((prev) => ({ ...prev, [orderId]: { kind: "error", message } }));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">Packaging QC</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Scan a printed roll to clear it for dispatch.
          </p>
        </div>
        <button
          onClick={() => void load()}
          className="rounded-md border border-zinc-200 px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          <button
            onClick={() => void load()}
            className="mt-2 text-xs font-medium text-red-900 underline dark:text-red-100"
          >
            Try again
          </button>
        </div>
      ) : null}

      <section className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-900 dark:bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-900">
          <h2 className="text-sm font-semibold">Awaiting QC</h2>
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
            {awaiting.length}
          </span>
        </div>

        {loading && orders.length === 0 ? (
          <div className="space-y-2 p-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-5 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
            ))}
          </div>
        ) : awaiting.length === 0 ? (
          <p className="p-4 text-sm text-zinc-500 dark:text-zinc-400">
            Nothing is waiting on QC. Orders appear here once a pharmacist approves
            them for printing.
          </p>
        ) : (
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-900">
            {awaiting.map((o) => {
              const isActive = activeOrderId === o.order_id;
              const result = outcome[o.order_id];
              return (
                <li key={o.order_id} className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{o.abha_address}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Order {o.order_id.slice(0, 8)} · {o.start_date} → {o.end_date}
                      </p>
                    </div>
                    {!isActive ? (
                      <button
                        onClick={() => {
                          setActiveOrderId(o.order_id);
                          setQrPayload("");
                        }}
                        className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
                      >
                        Scan roll
                      </button>
                    ) : null}
                  </div>

                  {isActive ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        void submitScan(o.order_id);
                      }}
                      className="mt-3 flex flex-wrap items-center gap-2"
                    >
                      <input
                        autoFocus
                        value={qrPayload}
                        onChange={(e) => setQrPayload(e.target.value)}
                        placeholder="Scan or type the roll QR code"
                        className="min-w-[16rem] flex-1 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
                      />
                      <button
                        type="submit"
                        disabled={submitting || !qrPayload.trim()}
                        className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
                      >
                        {submitting ? "Recording…" : "Record QC scan"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveOrderId(null);
                          setQrPayload("");
                        }}
                        className="rounded-md border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800"
                      >
                        Cancel
                      </button>
                    </form>
                  ) : null}

                  {result?.kind === "error" ? (
                    <p role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">
                      {result.message}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-900 dark:bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-900">
          <h2 className="text-sm font-semibold">QC completed</h2>
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
            {completed.length}
          </span>
        </div>
        {completed.length === 0 ? (
          <p className="p-4 text-sm text-zinc-500 dark:text-zinc-400">
            No orders have cleared QC yet.
          </p>
        ) : (
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-900">
            {completed.slice(0, 10).map((o) => (
              <li key={o.order_id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium">{o.abha_address}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Order {o.order_id.slice(0, 8)}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                  Cleared for dispatch
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
