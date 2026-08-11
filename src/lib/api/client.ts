import type { ApiError, ApiSuccess } from "@/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

export class ApiRequestError extends Error {
  status: number;
  errors?: { field: string; message: string }[];

  constructor(
    message: string,
    status: number,
    errors?: { field: string; message: string }[],
  ) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.errors = errors;
  }
}

let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  skipAuth?: boolean;
  isRetry?: boolean;
};

function devLog(level: "warn" | "error", ...args: unknown[]) {
  if (process.env.NODE_ENV !== "production") {
    if (level === "error") {
      console.error("[api]", ...args);
    } else {
      console.warn("[api]", ...args);
    }
  }
}

async function doFetch(
  path: string,
  options: RequestOptions = {},
): Promise<Response> {
  const { body, skipAuth, headers, ...rest } = options;

  const finalHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (!skipAuth && accessToken) {
    (finalHeaders as Record<string, string>).Authorization =
      `Bearer ${accessToken}`;
  }

  return fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    credentials: "include", // needed for httpOnly refresh-token cookie
    // This is a stateful JSON API, not cacheable static content — freshness
    // is TanStack Query's job. Without this, the browser's own HTTP cache
    // can transparently revalidate a GET via a conditional request and the
    // server can answer 304; that's normally invisible to fetch() (the
    // browser resolves it using the cached body), but it depends on the
    // cache having stored a matching entry for this exact URL+credentials
    // combination, and any miss there produces an unpredictable empty body.
    // `no-store` removes the browser's HTTP cache from the equation
    // entirely, so every request round-trips for a real body every time.
    cache: "no-store",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

/**
 * POST /auth/refresh-token responds with `{ success, message, accessToken }`
 * — the accessToken is top-level, NOT nested under `data` like every other
 * endpoint in this API. This is the one documented exception, so it gets
 * its own raw fetch instead of going through `request()`'s `data` unwrap.
 *
 * This is the ONLY place a refresh-token request is issued from — both the
 * automatic 401-retry below and AuthProvider's session-bootstrap call go
 * through this same exported function, sharing the same in-flight promise,
 * so concurrent triggers (e.g. a 401 firing mid-bootstrap, or React
 * StrictMode double-invoking an effect in dev) can never produce two
 * simultaneous refresh requests.
 */
export async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await doFetch("/auth/refresh-token", {
          method: "POST",
          skipAuth: true,
        });
        if (!res.ok) return null;
        const json = (await res.json()) as {
          success: boolean;
          accessToken?: string;
        };
        const token = json.accessToken ?? null;
        setAccessToken(token);
        return token;
      } catch (err) {
        devLog("warn", "refresh-token request failed", err);
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  let res = await doFetch(path, options);

  if (res.status === 401 && !options.skipAuth && !options.isRetry) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      res = await doFetch(path, { ...options, isRetry: true });
    }
  }

  const rawText = await res.text();
  let json: ApiSuccess<T> | ApiError | undefined;
  try {
    json = rawText ? JSON.parse(rawText) : undefined;
  } catch {
    // Server returned a non-JSON body (e.g. an HTML/stack-trace error page
    // from an unhandled exception). Log the raw text in dev so the real
    // backend error is visible instead of a generic "Request failed".
    devLog(
      "error",
      `${options.method ?? "GET"} ${path} returned non-JSON body`,
      rawText.slice(0, 500),
    );
  }

  if (!res.ok || !json || json.success === false) {
    const errJson = json as ApiError | undefined;
    const message =
      errJson?.message ?? `Request failed with status ${res.status}`;
    devLog(
      "error",
      `${options.method ?? "GET"} ${path} failed (${res.status})`,
      {
        message,
        errors: errJson?.errors,
      },
    );
    throw new ApiRequestError(message, res.status, errJson?.errors);
  }

  const successJson = json as ApiSuccess<T>;

  // A 200/2xx response with `success: true` but a missing `data` field is a
  // contract violation, not a valid empty result. Resolving it as `undefined`
  // here is exactly what was surfacing as React Query's opaque "Query data
  // cannot be undefined" crash several layers away, with no indication of
  // which request actually caused it. Throwing here instead turns that into
  // an immediately actionable, request-scoped error.
  if (successJson.data === undefined) {
    devLog(
      "error",
      `${options.method ?? "GET"} ${path} returned success with no "data" field`,
      json,
    );
    throw new ApiRequestError(
      `Malformed response from ${options.method ?? "GET"} ${path}: missing "data" field`,
      res.status,
    );
  }

  return successJson.data;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
