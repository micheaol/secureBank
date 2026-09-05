import { apiSlice } from "./apiSlice";
import { unwrapApiResponseData } from "./unwrapApiResponseData";

export const beneficiariesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyBeneficiaries: builder.query({
      query: () => "/beneficiaries",
      transformResponse: (response) => unwrapApiResponseData(response)?.beneficiaries,
      providesTags: ["Beneficiary"],
    }),

    addBeneficiary: builder.mutation({
      query: (beneficiaryDetails) => ({
        url: "/beneficiaries",
        method: "POST",
        body: beneficiaryDetails,
      }),
      transformResponse: unwrapApiResponseData,
      invalidatesTags: ["Beneficiary"],
    }),

    removeBeneficiary: builder.mutation({
      query: (beneficiaryId) => ({
        url: `/beneficiaries/${beneficiaryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Beneficiary"],
    }),
  }),
});

export const {
  useGetMyBeneficiariesQuery,
  useAddBeneficiaryMutation,
  useRemoveBeneficiaryMutation,
} = beneficiariesApi;
