import { API_BASE_URL, clearSession, getToken } from "@/lib/auth";

export { API_BASE_URL };

/** Thrown when the backend rejects the call. `status` lets callers branch. */
export class ApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * fetch + bearer token + uniform error handling.
 *
 * A 401 means the token is missing/expired, so the session is cleared and the
 * auth gate re-renders the sign-in form. A 403 means the token is valid but the
 * role is wrong — that is a real authorization error and is surfaced as-is
 * rather than silently signing the user out.
 */
export async function authFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = getToken();

  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (res.status === 401) {
    clearSession();
    throw new ApiError("Your session expired. Please sign in again.", 401);
  }

  return res;
}

/** Throw a useful error unless the response is ok. */
export async function assertOk(res: Response, label: string): Promise<void> {
  if (res.ok) return;

  const detail = await res
    .clone()
    .json()
    .then((b) => (typeof b?.detail === "string" ? b.detail : null))
    .catch(() => null);
  const text = detail ?? (await res.text().catch(() => "")) ?? "";

  if (res.status === 403) {
    throw new ApiError(
      text || `Not authorized for ${label}. This action needs a pharmacist or admin role.`,
      403
    );
  }
  throw new ApiError(`${label} failed (${res.status}): ${text || res.statusText}`, res.status);
}

/** GET + parse JSON. */
export async function getJson<T>(path: string, label: string): Promise<T> {
  const res = await authFetch(path);
  await assertOk(res, label);
  return (await res.json()) as T;
}

/** POST + parse JSON. */
export async function postJson<T>(path: string, body: unknown, label: string): Promise<T> {
  const res = await authFetch(path, { method: "POST", body: JSON.stringify(body ?? {}) });
  await assertOk(res, label);
  return (await res.json()) as T;
}
