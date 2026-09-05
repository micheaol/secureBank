import { apiSlice } from "./apiSlice";
import { unwrapApiResponseData } from "./unwrapApiResponseData";

export const environmentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    resetEnvironment: builder.mutation({
      query: (environmentId) => ({ url: `/environments/${environmentId}/reset`, method: "POST" }),
      transformResponse: (response) => unwrapApiResponseData(response)?.environment,
    }),
    terminateEnvironment: builder.mutation({
      query: (environmentId) => ({ url: `/environments/${environmentId}/terminate`, method: "POST" }),
      transformResponse: (response) => unwrapApiResponseData(response)?.environment,
    }),
    extendEnvironment: builder.mutation({
      query: (environmentId) => ({ url: `/environments/${environmentId}/extend`, method: "POST" }),
      transformResponse: (response) => unwrapApiResponseData(response)?.environment,
    }),
  }),
});

export const { useResetEnvironmentMutation, useTerminateEnvironmentMutation, useExtendEnvironmentMutation } =
  environmentsApi;
