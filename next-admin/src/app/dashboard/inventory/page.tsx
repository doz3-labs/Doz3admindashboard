"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, RefreshCw, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getInventoryBatches, type InventoryBatch } from "@/lib/api/operations";

const MIN_STOCK = 50;

function daysUntil(dateIso: string) {
  const d = new Date(dateIso);
  const ms = d.getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export default function InventoryPage() {
  const [rows, setRows] = useState<InventoryBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const fetchRows = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getInventoryBatches();
      setRows(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      return (
        r.batch_number.toLowerCase().includes(q) ||
        r.medication_name.toLowerCase().includes(q) ||
        r.medication_dosage.toLowerCase().includes(q) ||
        r.medication_form_factor.toLowerCase().includes(q)
      );
    });
  }, [query, rows]);

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-900 dark:bg-zinc-950">
      <div className="flex flex-col gap-3 border-b border-zinc-200 p-4 dark:border-zinc-900 md:flex-row md:items-center md:justify-between">
        <div className="space-y-0.5">
          <div className="text-sm font-semibold">Inventory batches</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Alerts for expiry within 90 days or low stock (&lt; {MIN_STOCK}).
          </div>
        </div>
        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
          <div className="relative w-full md:w-80">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search medication / batch…"
              className="pl-9"
            />
          </div>
          <Button variant="outline" onClick={fetchRows} disabled={loading}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {error ? (
        <div className="m-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Medication</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Expiry</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Alerts</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
                Loading…
              </TableCell>
            </TableRow>
          ) : filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
                No batches found.
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((r) => {
              const expiryInDays = daysUntil(r.expiry_date);
              const expiryRisk = expiryInDays <= 90;
              const lowStock = r.current_stock_count < MIN_STOCK;
              return (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="font-medium">{r.medication_name}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {r.medication_dosage} • {r.medication_form_factor}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{r.batch_number}</TableCell>
                  <TableCell className={expiryRisk ? "text-red-700 dark:text-red-300" : ""}>
                    {new Date(r.expiry_date).toLocaleDateString("en-IN")}
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">{expiryInDays} days</div>
                  </TableCell>
                  <TableCell className={lowStock ? "text-red-700 dark:text-red-300 font-semibold" : ""}>
                    {r.current_stock_count}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {expiryRisk ? (
                        <Badge variant="pending" className="border-red-200 bg-red-50 text-red-800 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          Expiring
                        </Badge>
                      ) : null}
                      {lowStock ? (
                        <Badge variant="pending" className="border-red-200 bg-red-50 text-red-800 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          Low stock
                        </Badge>
                      ) : null}
                      {!expiryRisk && !lowStock ? <Badge variant="approved">OK</Badge> : null}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

