import { apiSlice } from "./apiSlice";
import { unwrapApiResponseData } from "./unwrapApiResponseData";

export const accountsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyAccounts: builder.query({
      query: () => "/accounts",
      transformResponse: unwrapApiResponseData,
      providesTags: ["Account"],
    }),
  }),
});

export const { useGetMyAccountsQuery } = accountsApi;
