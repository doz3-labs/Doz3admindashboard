import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DOZ3 Admin",
  description: "Pharmacist operations dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100"
      >
        <div className="flex min-h-screen">
          <AppSidebar />
          <div className="flex-1">
            <div className="h-14 border-b border-zinc-200 bg-white px-4 flex items-center justify-between dark:border-zinc-900 dark:bg-zinc-950">
              <div className="text-sm font-semibold">Dashboard</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Signed in as Pharmacist</div>
            </div>
            <main className="p-4 md:p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
