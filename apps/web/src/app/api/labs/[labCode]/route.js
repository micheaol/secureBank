import { forwardAuthenticatedBackendRequest } from "@/lib/session/forwardAuthenticatedBackendRequest";

export async function GET(request, context) {
  const { labCode } = await context.params;
  return forwardAuthenticatedBackendRequest(request, `/labs/${labCode}`);
}
