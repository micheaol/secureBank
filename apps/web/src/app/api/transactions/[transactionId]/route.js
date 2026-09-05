import { forwardAuthenticatedBackendRequest } from "@/lib/session/forwardAuthenticatedBackendRequest";

export async function GET(request, context) {
  const { transactionId } = await context.params;
  return forwardAuthenticatedBackendRequest(request, `/transactions/${transactionId}`);
}
