import { NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE_NAME } from "@/lib/session/sessionCookieNames";

const PUBLIC_BANK_ROUTES = ["/bank/login", "/bank/register", "/bank/forgot-password", "/bank/reset-password"];

/**
 * Optimistic auth redirect only (per Next.js's authentication guide): reads
 * the access-token cookie's presence, not its validity. The Express backend
 * remains the authority - every protected API call is still verified there.
 */
export function proxy(request) {
  const requestPath = request.nextUrl.pathname;
  const hasAccessTokenCookie = Boolean(request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value);
  const isPublicBankRoute = PUBLIC_BANK_ROUTES.includes(requestPath);

  if (!isPublicBankRoute && !hasAccessTokenCookie) {
    return NextResponse.redirect(new URL("/bank/login", request.url));
  }

  if (isPublicBankRoute && hasAccessTokenCookie) {
    return NextResponse.redirect(new URL("/bank/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/bank/:path*"],
};
