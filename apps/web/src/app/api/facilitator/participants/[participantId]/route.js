import { forwardAuthenticatedBackendRequest } from "@/lib/session/forwardAuthenticatedBackendRequest";

export async function GET(request, context) {
  const { participantId } = await context.params;
  return forwardAuthenticatedBackendRequest(request, `/facilitator/participants/${participantId}`);
}
