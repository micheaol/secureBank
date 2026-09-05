import { forwardAuthenticatedBackendRequest } from "@/lib/session/forwardAuthenticatedBackendRequest";

export async function POST(request, context) {
  const { environmentId } = await context.params;
  return forwardAuthenticatedBackendRequest(request, `/environments/${environmentId}/terminate`, { method: "POST" });
}
