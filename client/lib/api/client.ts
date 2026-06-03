export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface FetchOptions extends Omit<RequestInit, "method" | "body"> {
  body?: unknown;
}

/**
 * Enhanced fetch client with default headers and automatic JSON parsing.
 */
async function fetchClient<T>(
  endpoint: string,
  method: HttpMethod,
  options: FetchOptions = {},
): Promise<T> {
  const url = `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  // Get token from local storage (or pass via options if needed)
  let token = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("rydway_token");
  }

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const { body, ...restOptions } = options;

  const config: RequestInit = {
    ...restOptions,
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);

    // Handle 401 Unauthorized globally if desired
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("rydway_token");
        // Optionally redirect to login
        // window.location.href = '/auth';
      }
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        data?.message || response.statusText || "Something went wrong",
      );
    }

    // Automatically unwrap standard backend response format { message: string, data: any }
    if (data && typeof data === 'object' && 'data' in data && 'message' in data) {
      return data.data as T;
    }

    return data as T;
  } catch (error) {
    console.error(`[API Error] ${method} ${url}`, error);
    throw error;
  }
}

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    fetchClient<T>(endpoint, "GET", options),
  post: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    fetchClient<T>(endpoint, "POST", { ...options, body }),
  put: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    fetchClient<T>(endpoint, "PUT", { ...options, body }),
  patch: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    fetchClient<T>(endpoint, "PATCH", { ...options, body }),
  delete: <T>(endpoint: string, options?: FetchOptions) =>
    fetchClient<T>(endpoint, "DELETE", options),
};
