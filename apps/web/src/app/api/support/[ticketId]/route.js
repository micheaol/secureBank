import { forwardAuthenticatedBackendRequest } from "@/lib/session/forwardAuthenticatedBackendRequest";

export async function GET(request, context) {
  const { ticketId } = await context.params;
  return forwardAuthenticatedBackendRequest(request, `/support/${ticketId}`);
}
