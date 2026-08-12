import type { ApiError, ApiSuccess } from "@/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

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
  allowEmptyResponse?: boolean;
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
  const {
    body,
    skipAuth,
    headers,
    allowEmptyResponse: _allowEmptyResponse,
    ...rest
  } = options;

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
    credentials: "include",
    cache: "no-store",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await doFetch("/auth/refresh-token", {
          method: "POST",
          skipAuth: true,
        });

        if (!res.ok) {
          return null;
        }

        const rawText = await res.text();

        if (!rawText) {
          return null;
        }

        const json = (JSON.parse(rawText) as {
          success: boolean;
          accessToken?: string;
        });

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
      res = await doFetch(path, {
        ...options,
        isRetry: true,
      });
    }
  }

  const rawText = await res.text();

  /**
   * DELETE can legitimately return:
   *
   * 204 No Content
   *
   * or:
   *
   * {
   *   success: true
   * }
   *
   * without a data property.
   */
  if (
    options.allowEmptyResponse &&
    (res.status === 204 || rawText.trim() === "")
  ) {
    if (!res.ok) {
      throw new ApiRequestError(
        `Request failed with status ${res.status}`,
        res.status,
      );
    }

    return undefined as T;
  }

  let json: ApiSuccess<T> | ApiError | undefined;

  try {
    json = rawText ? JSON.parse(rawText) : undefined;
  } catch {
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

    throw new ApiRequestError(
      message,
      res.status,
      errJson?.errors,
    );
  }

  const successJson = json as ApiSuccess<T>;

  /**
   * Some endpoints such as DELETE can return:
   *
   * {
   *   success: true,
   *   message: "User deleted successfully"
   * }
   *
   * without data.
   */
  if (successJson.data === undefined) {
    if (options.allowEmptyResponse) {
      return undefined as T;
    }

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
    request<T>(path, {
      ...options,
      method: "GET",
    }),

  post: <T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ) =>
    request<T>(path, {
      ...options,
      method: "POST",
      body,
    }),

  patch: <T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ) =>
    request<T>(path, {
      ...options,
      method: "PATCH",
      body,
    }),

  put: <T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ) =>
    request<T>(path, {
      ...options,
      method: "PUT",
      body,
    }),

  delete: <T = void>(
    path: string,
    options?: RequestOptions,
  ) =>
    request<T>(path, {
      ...options,
      method: "DELETE",
      allowEmptyResponse: true,
    }),
};