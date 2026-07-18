"use client";

import { useCallback, useEffect, useState } from "react";
import { clearSession, getSession, login, type Session } from "@/lib/auth";

/**
 * Gates the whole dashboard behind a pharmacist sign-in.
 *
 * Every endpoint this app calls is role-guarded on the backend, so without a
 * token the UI would render empty tables and a wall of 401s. This renders the
 * sign-in form instead until a real token exists.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  // Session lives in localStorage, which the server can't read — so render
  // nothing until the client has mounted, otherwise the markup mismatches.
  const [ready, setReady] = useState(false);

  const sync = useCallback(() => setSession(getSession()), []);

  useEffect(() => {
    sync();
    setReady(true);
    window.addEventListener("doz3-auth-change", sync);
    // Keep tabs in sync if the user signs out in another one.
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("doz3-auth-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, [sync]);

  if (!ready) return null;
  if (!session) return <SignInForm />;

  return (
    <>
      <div className="flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-900 dark:bg-zinc-950">
        <div className="text-sm font-semibold">Dashboard</div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {session.name || "Signed in"}
            <span className="ml-1 rounded bg-zinc-100 px-1.5 py-0.5 font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
              {session.role}
            </span>
          </span>
          <button
            type="button"
            onClick={clearSession}
            className="rounded-md border border-zinc-200 px-2.5 py-1 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
          >
            Sign out
          </button>
        </div>
      </div>
      <main className="p-4 md:p-6">{children}</main>
    </>
  );
}

function SignInForm() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(phone.trim(), otp.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-900 dark:bg-zinc-950"
      >
        <div>
          <h1 className="text-lg font-semibold">DOZ3 Operations</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Pharmacist sign-in required.
          </p>
        </div>

        <label className="block space-y-1">
          <span className="text-sm font-medium">Phone</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="numeric"
            autoComplete="tel"
            placeholder="9990002222"
            required
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium">OTP</span>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            inputMode="numeric"
            maxLength={6}
            placeholder="6-digit code"
            required
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
          />
        </label>

        {error ? (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
