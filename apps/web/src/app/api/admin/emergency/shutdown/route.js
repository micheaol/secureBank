import { forwardAuthenticatedBackendRequest } from "@/lib/session/forwardAuthenticatedBackendRequest";

export async function POST(request) {
  const body = await request.json();
  return forwardAuthenticatedBackendRequest(request, "/admin/emergency/shutdown", { method: "POST", body });
}
