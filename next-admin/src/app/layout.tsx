import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthGate } from "@/components/auth-gate";

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
            {/* Renders the sign-in form until a real pharmacist token exists;
                the header now shows the actual signed-in user, not a label. */}
            <AuthGate>{children}</AuthGate>
          </div>
        </div>
      </body>
    </html>
  );
}
