import { apiSlice } from "./apiSlice";
import { unwrapApiResponseData } from "./unwrapApiResponseData";

export const achievementsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyAchievements: builder.query({
      query: () => "/achievements",
      transformResponse: (response) => unwrapApiResponseData(response)?.achievements,
      providesTags: ["Score"],
    }),
  }),
});

export const { useGetMyAchievementsQuery } = achievementsApi;
