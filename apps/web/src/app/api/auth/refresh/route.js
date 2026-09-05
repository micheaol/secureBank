import { NextResponse } from "next/server";
import { callBackendApi } from "@/lib/api/backendClient";
import { setSessionCookiesOnResponse, clearSessionCookiesOnResponse } from "@/lib/session/sessionCookies";
import { REFRESH_TOKEN_COOKIE_NAME } from "@/lib/session/sessionCookieNames";

export async function POST(request) {
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { success: false, message: "No active session to refresh.", errors: null },
      { status: 401 }
    );
  }

  const { status, body } = await callBackendApi("/auth/refresh", {
    method: "POST",
    body: { refreshToken },
  });

  if (!body?.success) {
    const failureResponse = NextResponse.json(body, { status });
    clearSessionCookiesOnResponse(failureResponse);
    return failureResponse;
  }

  const { accessToken, refreshToken: rotatedRefreshToken, user } = body.data;
  const response = NextResponse.json(
    { success: true, message: body.message, data: { user } },
    { status }
  );
  setSessionCookiesOnResponse(response, { accessToken, refreshToken: rotatedRefreshToken });
  return response;
}
