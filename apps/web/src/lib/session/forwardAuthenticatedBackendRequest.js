import "server-only";
import { NextResponse } from "next/server";
import { callBackendApi } from "../api/backendClient";
import { ACCESS_TOKEN_COOKIE_NAME } from "./sessionCookieNames";

/**
 * Shared by every Next.js API route that simply forwards an authenticated
 * request to the Express backend (e.g. /api/users/me, /api/accounts): reads
 * the access token from its httpOnly cookie and attaches it as a Bearer
 * token, so the browser never has direct access to it.
 */
export async function forwardAuthenticatedBackendRequest(request, backendPath, { method = "GET", body } = {}) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "Authentication required.", errors: null },
      { status: 401 }
    );
  }

  const { status, body: responseBody } = await callBackendApi(backendPath, {
    method,
    body,
    accessToken,
  });

  return NextResponse.json(responseBody, { status });
}
