"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Users, Layers, ScanLine } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/prescriptions", label: "Prescriptions", icon: FileText },
  { href: "/patients", label: "Patients", icon: Users },
  { href: "/sorting-queue", label: "Sorting Queue", icon: Layers },
  { href: "/dashboard/inventory", label: "Inventory", icon: Layers },
  { href: "/dashboard/fulfillment", label: "Fulfillment", icon: Layers },
  { href: "/qc", label: "Packaging QC", icon: ScanLine },
] as const;

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-zinc-200 md:bg-white md:dark:border-zinc-900 md:dark:bg-zinc-950">
      <div className="flex h-14 items-center gap-2 border-b border-zinc-200 px-4 dark:border-zinc-900">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
          D
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">DOZ3</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Pharmacist Console</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900/50"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-zinc-200 p-3 text-xs text-zinc-500 dark:border-zinc-900 dark:text-zinc-400">
        Clinic: Indiranagar Hub
      </div>
    </aside>
  );
}

