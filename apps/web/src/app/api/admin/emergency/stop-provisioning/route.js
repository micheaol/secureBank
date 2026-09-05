import { forwardAuthenticatedBackendRequest } from "@/lib/session/forwardAuthenticatedBackendRequest";

export async function POST(request) {
  const body = await request.json();
  return forwardAuthenticatedBackendRequest(request, "/admin/emergency/stop-provisioning", { method: "POST", body });
}
