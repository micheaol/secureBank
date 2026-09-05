import { apiSlice } from "./apiSlice";
import { unwrapApiResponseData } from "./unwrapApiResponseData";

export const supportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMySupportTickets: builder.query({
      query: () => "/support",
      transformResponse: (response) => unwrapApiResponseData(response)?.tickets,
      providesTags: ["SupportTicket"],
    }),

    getMySupportTicketById: builder.query({
      query: (ticketId) => `/support/${ticketId}`,
      transformResponse: (response) => unwrapApiResponseData(response)?.ticket,
      providesTags: (result, error, ticketId) => [{ type: "SupportTicket", id: ticketId }],
    }),

    createSupportTicket: builder.mutation({
      query: (ticketDetails) => ({ url: "/support", method: "POST", body: ticketDetails }),
      transformResponse: (response) => unwrapApiResponseData(response)?.ticket,
      invalidatesTags: ["SupportTicket"],
    }),

    addSupportMessage: builder.mutation({
      query: ({ ticketId, message }) => ({
        url: `/support/${ticketId}/messages`,
        method: "POST",
        body: { message },
      }),
      invalidatesTags: (result, error, { ticketId }) => [{ type: "SupportTicket", id: ticketId }],
    }),
  }),
});

export const {
  useGetMySupportTicketsQuery,
  useGetMySupportTicketByIdQuery,
  useCreateSupportTicketMutation,
  useAddSupportMessageMutation,
} = supportApi;
