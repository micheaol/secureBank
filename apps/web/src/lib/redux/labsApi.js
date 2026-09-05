import { apiSlice } from "./apiSlice";
import { unwrapApiResponseData } from "./unwrapApiResponseData";

export const labsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLabs: builder.query({
      query: () => "/labs",
      transformResponse: (response) => unwrapApiResponseData(response)?.labs,
      providesTags: ["Lab"],
    }),

    getLabByCode: builder.query({
      query: (labCode) => `/labs/${labCode}`,
      transformResponse: (response) => unwrapApiResponseData(response)?.lab,
      providesTags: (result, error, labCode) => [{ type: "Lab", id: labCode }],
    }),

    getChallengesForLab: builder.query({
      query: (labCode) => `/labs/${labCode}/challenges`,
      transformResponse: unwrapApiResponseData,
      providesTags: (result, error, labCode) => [{ type: "Challenge", id: `LAB_${labCode}` }],
    }),
  }),
});

export const { useGetLabsQuery, useGetLabByCodeQuery, useGetChallengesForLabQuery } = labsApi;
