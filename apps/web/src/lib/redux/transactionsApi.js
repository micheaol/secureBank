import { apiSlice } from "./apiSlice";
import { unwrapApiResponseData } from "./unwrapApiResponseData";

function buildTransactionsQueryString(filters = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export const transactionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyTransactions: builder.query({
      query: (filters) => `/transactions${buildTransactionsQueryString(filters)}`,
      transformResponse: unwrapApiResponseData,
      providesTags: ["Transaction"],
    }),

    getMyTransactionById: builder.query({
      query: (transactionId) => `/transactions/${transactionId}`,
      transformResponse: (response) => unwrapApiResponseData(response)?.transaction,
      providesTags: (result, error, transactionId) => [{ type: "Transaction", id: transactionId }],
    }),
  }),
});

export const { useGetMyTransactionsQuery, useGetMyTransactionByIdQuery } = transactionsApi;
