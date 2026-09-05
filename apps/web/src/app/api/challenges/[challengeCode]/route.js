import { forwardAuthenticatedBackendRequest } from "@/lib/session/forwardAuthenticatedBackendRequest";

export async function GET(request, context) {
  const { challengeCode } = await context.params;
  return forwardAuthenticatedBackendRequest(request, `/challenges/${challengeCode}`);
}
