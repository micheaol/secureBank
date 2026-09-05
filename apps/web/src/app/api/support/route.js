import { forwardAuthenticatedBackendRequest } from "@/lib/session/forwardAuthenticatedBackendRequest";

export async function GET(request) {
  return forwardAuthenticatedBackendRequest(request, "/support");
}

export async function POST(request) {
  const ticketDetails = await request.json();
  return forwardAuthenticatedBackendRequest(request, "/support", { method: "POST", body: ticketDetails });
}
