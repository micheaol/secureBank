import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({ baseUrl: "/api" });

/**
 * Wraps the raw base query with a single silent-refresh retry: a 401 first
 * tries POST /api/auth/refresh (which rotates the httpOnly session cookies),
 * then replays the original request once before giving up.
 */
async function baseQueryWithReauthentication(args, apiContext, extraOptions) {
  let result = await rawBaseQuery(args, apiContext, extraOptions);

  if (result.error?.status === 401) {
    const refreshResult = await rawBaseQuery(
      { url: "/auth/refresh", method: "POST" },
      apiContext,
      extraOptions
    );

    if (refreshResult.data) {
      result = await rawBaseQuery(args, apiContext, extraOptions);
    }
  }

  return result;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauthentication,
  tagTypes: ["CurrentUser", "Account"],
  endpoints: () => ({}),
});
