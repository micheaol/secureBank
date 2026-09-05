import { forwardAuthenticatedBackendRequest } from "@/lib/session/forwardAuthenticatedBackendRequest";

export async function GET(request) {
  return forwardAuthenticatedBackendRequest(request, "/help-requests");
}

export async function POST(request) {
  const body = await request.json();
  return forwardAuthenticatedBackendRequest(request, "/help-requests", { method: "POST", body });
}
