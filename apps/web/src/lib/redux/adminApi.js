import { apiSlice } from "./apiSlice";
import { unwrapApiResponseData } from "./unwrapApiResponseData";

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOverview: builder.query({
      query: () => "/admin/overview",
      transformResponse: unwrapApiResponseData,
    }),
    getAdminEnvironments: builder.query({
      query: () => "/admin/environments",
      transformResponse: (response) => unwrapApiResponseData(response)?.environments,
      providesTags: ["AdminEnvironment"],
    }),
    terminateAdminEnvironment: builder.mutation({
      query: (environmentId) => ({ url: `/admin/environments/${environmentId}/terminate`, method: "POST" }),
      invalidatesTags: ["AdminEnvironment"],
    }),
    getAdminAuditLog: builder.query({
      query: () => "/admin/audit-log",
      transformResponse: (response) => unwrapApiResponseData(response)?.auditLog,
    }),
    getEmergencyStatus: builder.query({
      query: () => "/admin/emergency",
      transformResponse: unwrapApiResponseData,
      providesTags: ["AdminEmergency"],
    }),
    stopProvisioning: builder.mutation({
      query: (reason) => ({ url: "/admin/emergency/stop-provisioning", method: "POST", body: { reason } }),
      invalidatesTags: ["AdminEmergency"],
    }),
    resumeProvisioning: builder.mutation({
      query: (reason) => ({ url: "/admin/emergency/resume-provisioning", method: "POST", body: { reason } }),
      invalidatesTags: ["AdminEmergency"],
    }),
    disableLab: builder.mutation({
      query: ({ labCode, reason }) => ({ url: `/admin/emergency/labs/${labCode}/disable`, method: "POST", body: { reason } }),
      invalidatesTags: ["AdminEmergency"],
    }),
    enableLab: builder.mutation({
      query: ({ labCode, reason }) => ({ url: `/admin/emergency/labs/${labCode}/enable`, method: "POST", body: { reason } }),
      invalidatesTags: ["AdminEmergency"],
    }),
    terminateAllEnvironmentsForLab: builder.mutation({
      query: ({ labCode, reason }) => ({
        url: `/admin/emergency/labs/${labCode}/terminate-environments`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: ["AdminEnvironment"],
    }),
    emergencyShutdown: builder.mutation({
      query: (reason) => ({ url: "/admin/emergency/shutdown", method: "POST", body: { reason } }),
      invalidatesTags: ["AdminEmergency"],
    }),
    liftEmergencyShutdown: builder.mutation({
      query: (reason) => ({ url: "/admin/emergency/shutdown/lift", method: "POST", body: { reason } }),
      invalidatesTags: ["AdminEmergency"],
    }),
  }),
});

export const {
  useGetAdminOverviewQuery,
  useGetAdminEnvironmentsQuery,
  useTerminateAdminEnvironmentMutation,
  useGetAdminAuditLogQuery,
  useGetEmergencyStatusQuery,
  useStopProvisioningMutation,
  useResumeProvisioningMutation,
  useDisableLabMutation,
  useEnableLabMutation,
  useTerminateAllEnvironmentsForLabMutation,
  useEmergencyShutdownMutation,
  useLiftEmergencyShutdownMutation,
} = adminApi;
