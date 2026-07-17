"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { getOrderStats, type OrderStats } from "@/lib/api/operations";
import { Button } from "@/components/ui/button";

const STAT_CARDS: { key: keyof OrderStats; label: string; color: string }[] = [
  { key: "incoming_today", label: "Incoming today", color: "text-blue-600" },
  { key: "pending_approval", label: "Pending approvals", color: "text-orange-600" },
  { key: "approved_for_printing", label: "Approved for printing", color: "text-emerald-600" },
  { key: "qc_completed", label: "QC completed", color: "text-violet-600" },
  { key: "dispatched", label: "Dispatched", color: "text-cyan-600" },
  { key: "delivered", label: "Delivered", color: "text-green-600" },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { setStats(await getOrderStats()); } catch { /* silently degrade */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Real-time order pipeline for DOZ3 pharmacy operations.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {loading && !stats ? (
        <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-zinc-400" /></div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {STAT_CARDS.map((c) => (
            <div key={c.key} className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-900 dark:bg-zinc-950">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">{c.label}</div>
              <div className={`mt-1 text-2xl font-semibold ${c.color}`}>{stats?.[c.key] ?? 0}</div>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-900 dark:bg-zinc-950">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">All Orders</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">View and search every order.</div>
            </div>
            <Link href="/prescriptions" className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">Open</Link>
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-900 dark:bg-zinc-950">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Pharmacist Approval</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Review and approve pending orders.</div>
            </div>
            <Link href="/dashboard/fulfillment" className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">Open</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
