/**
 * Custom fetch mutator used by Orval-generated hooks.
 * All API calls go through here — this is where you'd add auth headers,
 * base URL, and unified error handling.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly data: unknown
  ) {
    super(`API Error ${status}`);
    this.name = "ApiError";
  }
}

export const fetchClient = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let errorData: unknown;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }
    throw new ApiError(response.status, errorData);
  }

  // 204 No Content — nothing to parse
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};
