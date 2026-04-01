import { PrescriptionsTable } from "./prescriptions-table";

export default function PrescriptionsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Prescriptions</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Incoming medical orders requiring pharmacist review.
        </p>
      </div>
      <PrescriptionsTable />
    </div>
  );
}

