import "server-only";
import { NextResponse } from "next/server";
import { callBackendApi } from "../api/backendClient";
import { setSessionCookiesOnResponse } from "./sessionCookies";

/**
 * Shared by /api/auth/register and /api/auth/login: forwards credentials to
 * the backend, then - on success - stores the returned access/refresh
 * tokens as httpOnly cookies instead of exposing them to client JavaScript.
 */
export async function performCredentialExchangeAndRespond(backendPath, credentials) {
  const { status, body } = await callBackendApi(backendPath, {
    method: "POST",
    body: credentials,
  });

  if (!body?.success) {
    return NextResponse.json(body, { status });
  }

  const { accessToken, refreshToken, user } = body.data;
  const response = NextResponse.json(
    { success: true, message: body.message, data: { user } },
    { status }
  );
  setSessionCookiesOnResponse(response, { accessToken, refreshToken });
  return response;
}
