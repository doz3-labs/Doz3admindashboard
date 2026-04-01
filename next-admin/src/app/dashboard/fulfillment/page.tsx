"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  type PendingPharmacistOrderSummary,
  approveOrderForPrinting,
  getPendingPharmacistOrders,
} from "@/lib/api/operations";

function statusToBadgeVariant(status: string): "pending" | "approved" | "sorting" | "default" {
  const s = status.toLowerCase();
  if (s.includes("approved")) return "approved";
  if (s.includes("pending")) return "pending";
  if (s.includes("dispatch") || s.includes("dispatched") || s.includes("delivery")) return "sorting";
  return "default";
}

export default function FulfillmentPage() {
  const [orders, setOrders] = useState<PendingPharmacistOrderSummary[]>([]);
  const [selected, setSelected] = useState<PendingPharmacistOrderSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPendingPharmacistOrders();
      setOrders(data);
      if (!selected && data.length) setSelected(data[0]);
      if (selected && !data.some((o) => o.order_id === selected.order_id)) setSelected(data[0] ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totals = useMemo(() => {
    const lines = selected?.lines ?? [];
    return lines.reduce(
      (acc, l) => {
        acc.morning += l.morning;
        acc.noon += l.noon;
        acc.night += l.night;
        return acc;
      },
      { morning: 0, noon: 0, night: 0 }
    );
  }, [selected]);

  const onApprove = async () => {
    if (!selected) return;
    setApproving(true);
    setError(null);
    try {
      await approveOrderForPrinting(selected.order_id);
      setOrders((prev) => prev.filter((q) => q.order_id !== selected.order_id));
      setSelected(null);
      // Keep UI responsive; next selected comes from refresh.
    } catch (e) {
      setError(e instanceof Error ? e.message : "Approval failed");
    } finally {
      setApproving(false);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-900 dark:bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-900">
          <div>
            <div className="text-sm font-semibold">Pending pharmacist orders</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">Approve for pouch printing</div>
          </div>
          <Button variant="outline" size="sm" onClick={loadOrders} disabled={loading}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {error ? (
          <div className="m-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
            {error}
          </div>
        ) : null}

        <div className="max-h-[70vh] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient ABHA</TableHead>
                <TableHead>Window</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    No pending orders.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((q) => {
                  const active = selected?.order_id === q.order_id;
                  return (
                    <TableRow
                      key={q.order_id}
                      className={active ? "bg-zinc-50 dark:bg-zinc-900/40" : ""}
                      onClick={() => setSelected(q)}
                      style={{ cursor: "pointer" }}
                    >
                      <TableCell className="font-mono text-xs">{q.abha_address}</TableCell>
                      <TableCell className="text-xs text-zinc-600 dark:text-zinc-300">
                        {new Date(q.window_start).toLocaleDateString("en-IN")} →{" "}
                        {new Date(q.window_end).toLocaleDateString("en-IN")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusToBadgeVariant(q.status)}>{q.status}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-900 dark:bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-900">
          <div>
            <div className="text-sm font-semibold">Dose schedule verification</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">Morning / Noon / Night breakdown</div>
          </div>
          <div className="flex items-center gap-2">
            <Badge>
              M {totals.morning} • N {totals.noon} • Nt {totals.night}
            </Badge>
            <Button onClick={onApprove} disabled={!selected || approving} size="sm">
              <CheckCircle2 className="h-4 w-4" />
              {approving ? "Approving…" : "Approve for Printing"}
            </Button>
          </div>
        </div>

        <div className="p-4">
          {!selected ? (
            <div className="text-sm text-zinc-500 dark:text-zinc-400">Select an order on the left.</div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-md border border-zinc-200 p-3 dark:border-zinc-900">
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Patient</div>
                <div className="mt-1 font-mono text-xs">{selected.abha_address}</div>
                <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                  Window: {new Date(selected.window_start).toLocaleDateString("en-IN")} →{" "}
                  {new Date(selected.window_end).toLocaleDateString("en-IN")}
                </div>
              </div>

              <div className="max-h-[60vh] overflow-auto rounded-md border border-zinc-200 dark:border-zinc-900">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medication</TableHead>
                      <TableHead className="text-right">Morning</TableHead>
                      <TableHead className="text-right">Noon</TableHead>
                      <TableHead className="text-right">Night</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selected.lines.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
                          No dose schedules for this window.
                        </TableCell>
                      </TableRow>
                    ) : (
                      selected.lines.map((l) => (
                        <TableRow key={l.medication_id}>
                          <TableCell>
                            <div className="font-medium">{l.medication_name}</div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400">
                              {l.medication_dosage} • {l.medication_form_factor}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-semibold">{l.morning}</TableCell>
                          <TableCell className="text-right font-semibold">{l.noon}</TableCell>
                          <TableCell className="text-right font-semibold">{l.night}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

