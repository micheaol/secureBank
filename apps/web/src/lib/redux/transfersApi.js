import { apiSlice } from "./apiSlice";
import { unwrapApiResponseData } from "./unwrapApiResponseData";

export const transfersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    initiateTransfer: builder.mutation({
      query: (transferDetails) => ({
        url: "/transfers",
        method: "POST",
        body: transferDetails,
      }),
      transformResponse: (response) => unwrapApiResponseData(response)?.transfer,
    }),

    confirmTransfer: builder.mutation({
      query: ({ transferId, otpCode }) => ({
        url: `/transfers/${transferId}/confirm`,
        method: "POST",
        body: { otpCode },
      }),
      transformResponse: (response) => unwrapApiResponseData(response)?.transfer,
      invalidatesTags: ["Account", "Transaction"],
    }),
  }),
});

export const { useInitiateTransferMutation, useConfirmTransferMutation } = transfersApi;
