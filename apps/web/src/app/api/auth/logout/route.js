import { NextResponse } from "next/server";
import { callBackendApi } from "@/lib/api/backendClient";
import { clearSessionCookiesOnResponse } from "@/lib/session/sessionCookies";
import { REFRESH_TOKEN_COOKIE_NAME } from "@/lib/session/sessionCookieNames";

export async function POST(request) {
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value;

  if (refreshToken) {
    await callBackendApi("/auth/logout", { method: "POST", body: { refreshToken } });
  }

  const response = NextResponse.json({ success: true, message: "Signed out successfully." });
  clearSessionCookiesOnResponse(response);
  return response;
}
