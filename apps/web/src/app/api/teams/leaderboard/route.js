import { forwardAuthenticatedBackendRequest } from "@/lib/session/forwardAuthenticatedBackendRequest";

export async function GET(request) {
  return forwardAuthenticatedBackendRequest(request, "/teams/leaderboard");
}
