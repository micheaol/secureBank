import { forwardAuthenticatedBackendRequest } from "@/lib/session/forwardAuthenticatedBackendRequest";

export async function POST(request, context) {
  const { ticketId } = await context.params;
  const messageDetails = await request.json();
  return forwardAuthenticatedBackendRequest(request, `/support/${ticketId}/messages`, {
    method: "POST",
    body: messageDetails,
  });
}
