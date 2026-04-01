import Link from "next/link";

const tabs = [
  { href: "/dashboard/inventory", label: "Inventory" },
  { href: "/dashboard/fulfillment", label: "Fulfillment" },
] as const;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Operations</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Inventory and fulfillment workflow.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}

