import "server-only";
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from "./sessionCookieNames";

// Keep these in sync with services/api's JWT_ACCESS_EXPIRES_IN /
// JWT_REFRESH_EXPIRES_IN_DAYS so the browser cookie never outlives the
// token the backend actually honours.
const ACCESS_TOKEN_MAX_AGE_SECONDS = 15 * 60;
const REFRESH_TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

function buildSessionCookieOptions(maxAgeSeconds) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export function setSessionCookiesOnResponse(response, { accessToken, refreshToken }) {
  response.cookies.set(
    ACCESS_TOKEN_COOKIE_NAME,
    accessToken,
    buildSessionCookieOptions(ACCESS_TOKEN_MAX_AGE_SECONDS)
  );
  response.cookies.set(
    REFRESH_TOKEN_COOKIE_NAME,
    refreshToken,
    buildSessionCookieOptions(REFRESH_TOKEN_MAX_AGE_SECONDS)
  );
}

export function clearSessionCookiesOnResponse(response) {
  response.cookies.set(ACCESS_TOKEN_COOKIE_NAME, "", { ...buildSessionCookieOptions(0), maxAge: 0 });
  response.cookies.set(REFRESH_TOKEN_COOKIE_NAME, "", { ...buildSessionCookieOptions(0), maxAge: 0 });
}
