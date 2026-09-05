import { forwardAuthenticatedBackendRequest } from "@/lib/session/forwardAuthenticatedBackendRequest";

export async function DELETE(request, context) {
  const { beneficiaryId } = await context.params;
  return forwardAuthenticatedBackendRequest(request, `/beneficiaries/${beneficiaryId}`, { method: "DELETE" });
}
