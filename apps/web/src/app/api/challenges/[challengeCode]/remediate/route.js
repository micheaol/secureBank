import { forwardAuthenticatedBackendRequest } from "@/lib/session/forwardAuthenticatedBackendRequest";

export async function POST(request, context) {
  const { challengeCode } = await context.params;
  return forwardAuthenticatedBackendRequest(request, `/challenges/${challengeCode}/remediate`, { method: "POST" });
}
