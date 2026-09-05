import { apiSlice } from "./apiSlice";
import { unwrapApiResponseData } from "./unwrapApiResponseData";

export const scoringApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyScore: builder.query({
      query: () => "/scoring/me",
      transformResponse: unwrapApiResponseData,
      providesTags: ["Score"],
    }),
    getLeaderboard: builder.query({
      query: () => "/scoring/leaderboard",
      transformResponse: (response) => unwrapApiResponseData(response)?.leaderboard,
    }),
  }),
});

export const { useGetMyScoreQuery, useGetLeaderboardQuery } = scoringApi;
