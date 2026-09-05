import { apiSlice } from "./apiSlice";
import { unwrapApiResponseData } from "./unwrapApiResponseData";

export const helpRequestsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    requestFacilitatorHelp: builder.mutation({
      query: (helpDetails) => ({ url: "/help-requests", method: "POST", body: helpDetails }),
    }),
    getOpenHelpRequests: builder.query({
      query: () => "/help-requests",
      transformResponse: (response) => unwrapApiResponseData(response)?.helpRequests,
      providesTags: ["HelpRequest"],
    }),
    resolveHelpRequest: builder.mutation({
      query: (helpRequestId) => ({ url: `/help-requests/${helpRequestId}/resolve`, method: "PATCH" }),
      invalidatesTags: ["HelpRequest"],
    }),
  }),
});

export const { useRequestFacilitatorHelpMutation, useGetOpenHelpRequestsQuery, useResolveHelpRequestMutation } =
  helpRequestsApi;
