
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"
).replace(/\/+$/, "");

export class ApiError extends Error {
  code: string;
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(
    message: string,
    code: string,
    status: number,
    fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers = new Headers(options.headers);

  // Set JSON Content-Type for normal request bodies.
  // Do not set it for FormData: the browser must add the multipart boundary.
  if (
    options.body != null &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  // Attach JWT authentication when available.
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new ApiError(
      "Cannot connect to the server. Check that the backend is running.",
      "NETWORK_ERROR",
      0,
    );
  }

  const responseText = await response.text();

  let data: any = null;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      data?.message || `Request failed (${response.status})`,
      data?.code || "API_ERROR",
      response.status,
      data?.fieldErrors,
    );
  }

  return data as T;
}
