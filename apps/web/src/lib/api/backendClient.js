import "server-only";

const BACKEND_API_BASE_URL = process.env.API_BASE_URL || "http://localhost:4000/api/v1";

/**
 * Server-only fetch wrapper for calling the SecureBank Express backend.
 * Only Next.js Route Handlers should import this - the backend's address
 * and internal API shape must never reach the browser bundle.
 */
export async function callBackendApi(path, { method = "GET", body, accessToken } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${BACKEND_API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const responseBody = await response.json().catch(() => null);

  return { status: response.status, body: responseBody };
}
