import { forwardAuthenticatedBackendRequest } from "@/lib/session/forwardAuthenticatedBackendRequest";

export async function POST(request, context) {
  const { labCode } = await context.params;
  const body = await request.json();
  return forwardAuthenticatedBackendRequest(request, `/admin/emergency/labs/${labCode}/enable`, { method: "POST", body });
}
