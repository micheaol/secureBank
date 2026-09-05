import { forwardAuthenticatedBackendRequest } from "@/lib/session/forwardAuthenticatedBackendRequest";

export async function POST(request, context) {
  const { environmentId } = await context.params;
  return forwardAuthenticatedBackendRequest(request, `/admin/environments/${environmentId}/terminate`, { method: "POST" });
}
