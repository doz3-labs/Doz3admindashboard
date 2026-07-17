import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getPendingOrders, approveOrder, type PendingOrder } from "../lib/api";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export function IncomingPrescriptionOrders() {
  const [items, setItems] = useState<PendingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approving, setApproving] = useState<Record<string, boolean>>({});

  async function refresh() {
    try {
      setError(null);
      setItems(await getPendingOrders());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    const t = window.setInterval(refresh, 8000);
    return () => window.clearInterval(t);
  }, []);

  async function handleApprove(order: PendingOrder) {
    setApproving((m) => ({ ...m, [order.order_id]: true }));
    try {
      await approveOrder(order.order_id);
      setItems((prev) => prev.filter((o) => o.order_id !== order.order_id));
      toast.success(`Order for ${order.abha_address} approved for printing`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Approval failed");
    } finally {
      setApproving((m) => ({ ...m, [order.order_id]: false }));
    }
  }

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-base">Pending Pharmacist Approval</CardTitle>
          <div className="text-xs text-muted-foreground">
            Review dose schedules and approve orders for the sorting facility.
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={items.length > 0 ? "default" : "secondary"}>
            {items.length} pending
          </Badge>
          <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
            {error}
          </div>
        ) : loading ? (
          <div className="text-sm text-muted-foreground">Loading…</div>
        ) : items.length === 0 ? (
          <div className="text-sm text-muted-foreground">No orders pending approval.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient (ABHA)</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Medications (M / N / Nt)</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((o) => (
                <TableRow key={o.order_id}>
                  <TableCell>
                    <div className="font-medium">{o.abha_address}</div>
                    <div className="text-xs text-muted-foreground">
                      {o.order_id.slice(0, 8)}…
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{o.window_start} → {o.window_end}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {o.lines.map((l) => (
                        <div key={l.medication_id} className="flex items-center gap-2">
                          <span className="text-sm font-medium">{l.medication_name} {l.medication_dosage}</span>
                          <div className="flex gap-1">
                            {l.morning > 0 && <Badge variant="secondary">M: {l.morning}</Badge>}
                            {l.noon > 0 && <Badge variant="secondary">N: {l.noon}</Badge>}
                            {l.night > 0 && <Badge variant="secondary">Nt: {l.night}</Badge>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleApprove(o)}
                      disabled={approving[o.order_id]}
                    >
                      {approving[o.order_id] ? "Approving…" : "Approve & Print"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

