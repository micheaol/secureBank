import { apiSlice } from "./apiSlice";
import { unwrapApiResponseData } from "./unwrapApiResponseData";

export const facilitatorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFacilitatorOverview: builder.query({
      query: () => "/facilitator/overview",
      transformResponse: unwrapApiResponseData,
    }),
    getFacilitatorLabHealth: builder.query({
      query: () => "/facilitator/lab-health",
      transformResponse: (response) => unwrapApiResponseData(response)?.labHealth,
    }),
    getFacilitatorParticipants: builder.query({
      query: () => "/facilitator/participants",
      transformResponse: (response) => unwrapApiResponseData(response)?.participants,
    }),
    getFacilitatorParticipantDetail: builder.query({
      query: (participantId) => `/facilitator/participants/${participantId}`,
      transformResponse: (response) => unwrapApiResponseData(response)?.participant,
    }),
    extendParticipantEnvironment: builder.mutation({
      query: (environmentId) => ({ url: `/facilitator/environments/${environmentId}/extend`, method: "POST" }),
    }),
    resetParticipantEnvironment: builder.mutation({
      query: (environmentId) => ({ url: `/facilitator/environments/${environmentId}/reset`, method: "POST" }),
    }),
  }),
});

export const {
  useGetFacilitatorOverviewQuery,
  useGetFacilitatorLabHealthQuery,
  useGetFacilitatorParticipantsQuery,
  useGetFacilitatorParticipantDetailQuery,
  useExtendParticipantEnvironmentMutation,
  useResetParticipantEnvironmentMutation,
} = facilitatorApi;
