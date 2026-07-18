/**
 * Token store for the admin dashboard.
 *
 * Every /admin/*, /inventory/* and /fulfillment/* endpoint is role-guarded
 * (PHARMACIST or ADMIN) on the backend, so without a bearer token every page
 * in this app 401s. The token is obtained from the pharmacist portal login and
 * kept in localStorage.
 *
 * Note this is a client-only store — all pages in this app are "use client".
 */

const TOKEN_KEY = "doz3_admin_token";
const ROLE_KEY = "doz3_admin_role";
const NAME_KEY = "doz3_admin_name";
const USER_ID_KEY = "doz3_admin_user_id";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:8000";

export type Session = {
  token: string;
  role: string;
  name: string;
  userId: string;
};

const isBrowser = () => typeof window !== "undefined";

export function getToken(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getSession(): Session | null {
  if (!isBrowser()) return null;
  const token = window.localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  return {
    token,
    role: window.localStorage.getItem(ROLE_KEY) ?? "",
    name: window.localStorage.getItem(NAME_KEY) ?? "",
    userId: window.localStorage.getItem(USER_ID_KEY) ?? "",
  };
}

export function clearSession() {
  if (!isBrowser()) return;
  [TOKEN_KEY, ROLE_KEY, NAME_KEY, USER_ID_KEY].forEach((k) =>
    window.localStorage.removeItem(k)
  );
  window.dispatchEvent(new Event("doz3-auth-change"));
}

type LoginResponse = {
  access_token: string;
  token_type: string;
  user_id: string;
  role: string;
  name: string;
};

/**
 * Sign in against the pharmacist portal. The backend refuses this endpoint to
 * any user not provisioned with exactly the PHARMACIST role, so a patient or
 * doctor phone gets a 403 here rather than a usable admin token.
 */
export async function login(phone: string, otp: string): Promise<Session> {
  const res = await fetch(`${API_BASE_URL}/auth/pharmacist/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Field is `phone` — the backend's LoginRequest rejects `phone_number`.
    body: JSON.stringify({ phone, otp }),
  });

  if (!res.ok) {
    const detail = await res
      .json()
      .then((b) => b?.detail)
      .catch(() => null);
    if (res.status === 403) {
      throw new Error(
        detail ?? "This number is not authorized for the pharmacist portal."
      );
    }
    throw new Error(detail ?? `Sign-in failed (${res.status})`);
  }

  const data = (await res.json()) as LoginResponse;
  if (isBrowser()) {
    window.localStorage.setItem(TOKEN_KEY, data.access_token);
    window.localStorage.setItem(ROLE_KEY, data.role);
    window.localStorage.setItem(NAME_KEY, data.name);
    window.localStorage.setItem(USER_ID_KEY, data.user_id);
    window.dispatchEvent(new Event("doz3-auth-change"));
  }

  return {
    token: data.access_token,
    role: data.role,
    name: data.name,
    userId: data.user_id,
  };
}
