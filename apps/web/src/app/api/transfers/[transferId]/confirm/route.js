import { forwardAuthenticatedBackendRequest } from "@/lib/session/forwardAuthenticatedBackendRequest";

export async function POST(request, context) {
  const { transferId } = await context.params;
  const confirmationDetails = await request.json();
  return forwardAuthenticatedBackendRequest(request, `/transfers/${transferId}/confirm`, {
    method: "POST",
    body: confirmationDetails,
  });
}
