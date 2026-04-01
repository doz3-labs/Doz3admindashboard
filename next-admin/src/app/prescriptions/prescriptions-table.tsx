"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpDown, Loader2, RefreshCw, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllOrders, type AdminOrderSummary } from "@/lib/api/operations";

type Row = AdminOrderSummary;

function statusVariant(status: string): "pending" | "approved" | "sorting" | "default" {
  const s = status.toLowerCase();
  if (s.includes("pending")) return "pending";
  if (s.includes("approved") || s.includes("printing")) return "approved";
  if (s.includes("qc") || s.includes("dispatched")) return "sorting";
  if (s.includes("delivered")) return "default";
  return "default";
}

function humanStatus(raw: string): string {
  const map: Record<string, string> = {
    PaymentPending: "Payment Pending",
    PendingPharmacistApproval: "Pending Approval",
    ApprovedForPrinting: "Approved",
    PackagingQCCompleted: "QC Done",
    Dispatched: "Dispatched",
    Delivered: "Delivered",
  };
  return map[raw] ?? raw;
}

type SortKey = "order_id" | "abha_address" | "created_at" | "status";

export function PrescriptionsTable() {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRows(await getAllOrders());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? rows.filter((r) =>
          r.order_id.toLowerCase().includes(q) ||
          r.abha_address.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q)
        )
      : rows;

    const sorted = [...base].sort((a, b) => {
      if (sortKey === "created_at") {
        return Date.parse(a.created_at) - Date.parse(b.created_at);
      }
      return String(a[sortKey]).localeCompare(String(b[sortKey]));
    });

    if (sortDir === "desc") sorted.reverse();
    return sorted;
  }, [query, sortDir, sortKey, rows]);

  const setSort = (key: SortKey) => {
    if (sortKey === key) { setSortDir((d) => (d === "asc" ? "desc" : "asc")); return; }
    setSortKey(key);
    setSortDir("asc");
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-900 dark:bg-zinc-950">
      <div className="flex flex-col gap-3 border-b border-zinc-200 p-4 dark:border-zinc-900 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">All Orders</span>
          <Button variant="ghost" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search Order ID, ABHA, status…" className="pl-9" />
        </div>
      </div>

      {error && <div className="px-4 py-3 text-sm text-red-600">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-zinc-400" /></div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><Button variant="ghost" size="sm" onClick={() => setSort("order_id")} className="-ml-2">Order ID <ArrowUpDown className="h-4 w-4" /></Button></TableHead>
              <TableHead><Button variant="ghost" size="sm" onClick={() => setSort("abha_address")} className="-ml-2">Patient ABHA <ArrowUpDown className="h-4 w-4" /></Button></TableHead>
              <TableHead><Button variant="ghost" size="sm" onClick={() => setSort("created_at")} className="-ml-2">Date Received <ArrowUpDown className="h-4 w-4" /></Button></TableHead>
              <TableHead><Button variant="ghost" size="sm" onClick={() => setSort("status")} className="-ml-2">Status <ArrowUpDown className="h-4 w-4" /></Button></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.order_id}>
                <TableCell className="font-mono text-xs">{r.order_id.slice(0, 8)}…</TableCell>
                <TableCell className="font-mono text-xs">{r.abha_address}</TableCell>
                <TableCell className="text-sm text-zinc-600 dark:text-zinc-300">
                  {new Date(r.created_at).toLocaleString("en-IN")}
                </TableCell>
                <TableCell><Badge variant={statusVariant(r.status)}>{humanStatus(r.status)}</Badge></TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={4} className="py-10 text-center text-sm text-zinc-500">No orders found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-3 text-xs text-zinc-500 dark:border-zinc-900 dark:text-zinc-400">
        <div>Showing <span className="font-medium text-zinc-900 dark:text-zinc-100">{filtered.length}</span> orders</div>
        <div>Sort: <span className="font-medium text-zinc-900 dark:text-zinc-100">{sortKey}</span> ({sortDir})</div>
      </div>
    </div>
  );
}

