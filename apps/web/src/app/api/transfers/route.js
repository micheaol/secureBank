import { forwardAuthenticatedBackendRequest } from "@/lib/session/forwardAuthenticatedBackendRequest";

export async function GET(request) {
  return forwardAuthenticatedBackendRequest(request, "/transfers");
}

export async function POST(request) {
  const transferDetails = await request.json();
  return forwardAuthenticatedBackendRequest(request, "/transfers", { method: "POST", body: transferDetails });
}
