import { apiSlice } from "./apiSlice";
import { unwrapApiResponseData } from "./unwrapApiResponseData";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerAccount: builder.mutation({
      query: (registrationDetails) => ({
        url: "/auth/register",
        method: "POST",
        body: registrationDetails,
      }),
      transformResponse: unwrapApiResponseData,
      invalidatesTags: ["CurrentUser"],
    }),

    login: builder.mutation({
      query: (loginCredentials) => ({
        url: "/auth/login",
        method: "POST",
        body: loginCredentials,
      }),
      transformResponse: unwrapApiResponseData,
      invalidatesTags: ["CurrentUser"],
    }),

    logout: builder.mutation({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      invalidatesTags: ["CurrentUser", "Account"],
    }),

    requestPasswordReset: builder.mutation({
      query: (emailDetails) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: emailDetails,
      }),
    }),

    resetPassword: builder.mutation({
      query: (resetDetails) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: resetDetails,
      }),
    }),

    getCurrentUser: builder.query({
      query: () => "/users/me",
      transformResponse: unwrapApiResponseData,
      providesTags: ["CurrentUser"],
    }),
  }),
});

export const {
  useRegisterAccountMutation,
  useLoginMutation,
  useLogoutMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useGetCurrentUserQuery,
} = authApi;
