export type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const API_BASE_URL = "";

async function request<T>(path: string, method: RequestMethod = "GET", body?: unknown, headers?: Record<string, string>) {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const requestHeaders = new Headers(headers ?? {});

  if (!isFormData && body !== undefined && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body !== undefined && !isFormData ? JSON.stringify(body) : body as BodyInit | undefined,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return (await response.text()) as unknown as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path, "GET"),
  post: <T>(path: string, body?: unknown, headers?: Record<string, string>) => request<T>(path, "POST", body, headers),
  put: <T>(path: string, body?: unknown, headers?: Record<string, string>) => request<T>(path, "PUT", body, headers),
  patch: <T>(path: string, body?: unknown, headers?: Record<string, string>) => request<T>(path, "PATCH", body, headers),
  delete: <T>(path: string) => request<T>(path, "DELETE"),
  upload: <T>(path: string, formData: FormData) => request<T>(path, "POST", formData),
};
