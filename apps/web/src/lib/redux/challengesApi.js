import { apiSlice } from "./apiSlice";
import { unwrapApiResponseData } from "./unwrapApiResponseData";

export const challengesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChallengeByCode: builder.query({
      query: (challengeCode) => `/challenges/${challengeCode}`,
      transformResponse: (response) => unwrapApiResponseData(response)?.challenge,
      providesTags: (result, error, challengeCode) => [{ type: "Challenge", id: challengeCode }],
    }),

    startChallenge: builder.mutation({
      query: (challengeCode) => ({ url: `/challenges/${challengeCode}/start`, method: "POST" }),
      transformResponse: unwrapApiResponseData,
      invalidatesTags: (result, error, challengeCode) => [{ type: "Challenge", id: challengeCode }, "Challenge"],
    }),

    revealHint: builder.mutation({
      query: ({ challengeCode, hintOrder }) => ({
        url: `/challenges/${challengeCode}/hints/${hintOrder}`,
        method: "POST",
      }),
      transformResponse: (response) => unwrapApiResponseData(response)?.hint,
      invalidatesTags: (result, error, { challengeCode }) => [{ type: "Challenge", id: challengeCode }, "Score"],
    }),

    submitChallengeAnswer: builder.mutation({
      query: ({ challengeCode, answer, evidence }) => ({
        url: `/challenges/${challengeCode}/submit`,
        method: "POST",
        body: { answer, evidence },
      }),
      transformResponse: unwrapApiResponseData,
      invalidatesTags: (result, error, { challengeCode }) => [{ type: "Challenge", id: challengeCode }, "Challenge", "Score"],
    }),

    remediateChallenge: builder.mutation({
      query: (challengeCode) => ({ url: `/challenges/${challengeCode}/remediate`, method: "POST" }),
      transformResponse: unwrapApiResponseData,
      invalidatesTags: (result, error, challengeCode) => [{ type: "Challenge", id: challengeCode }, "Score"],
    }),
  }),
});

export const {
  useGetChallengeByCodeQuery,
  useStartChallengeMutation,
  useRevealHintMutation,
  useSubmitChallengeAnswerMutation,
  useRemediateChallengeMutation,
} = challengesApi;
