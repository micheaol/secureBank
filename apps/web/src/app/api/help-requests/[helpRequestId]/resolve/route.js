import { forwardAuthenticatedBackendRequest } from "@/lib/session/forwardAuthenticatedBackendRequest";

export async function PATCH(request, context) {
  const { helpRequestId } = await context.params;
  return forwardAuthenticatedBackendRequest(request, `/help-requests/${helpRequestId}/resolve`, { method: "PATCH" });
}
