import { apiSlice } from "./apiSlice";
import { unwrapApiResponseData } from "./unwrapApiResponseData";

export const teamsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyTeam: builder.query({
      query: () => "/teams/me",
      transformResponse: (response) => unwrapApiResponseData(response)?.team,
      providesTags: ["Score"],
    }),
    joinTeam: builder.mutation({
      query: (teamName) => ({ url: "/teams/join", method: "POST", body: { teamName } }),
      invalidatesTags: ["Score"],
    }),
    leaveTeam: builder.mutation({
      query: () => ({ url: "/teams/leave", method: "POST" }),
      invalidatesTags: ["Score"],
    }),
    getTeamLeaderboard: builder.query({
      query: () => "/teams/leaderboard",
      transformResponse: (response) => unwrapApiResponseData(response)?.leaderboard,
    }),
  }),
});

export const { useGetMyTeamQuery, useJoinTeamMutation, useLeaveTeamMutation, useGetTeamLeaderboardQuery } = teamsApi;
