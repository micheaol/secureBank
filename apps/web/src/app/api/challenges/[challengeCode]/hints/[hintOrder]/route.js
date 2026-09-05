import { forwardAuthenticatedBackendRequest } from "@/lib/session/forwardAuthenticatedBackendRequest";

export async function POST(request, context) {
  const { challengeCode, hintOrder } = await context.params;
  return forwardAuthenticatedBackendRequest(request, `/challenges/${challengeCode}/hints/${hintOrder}`, {
    method: "POST",
  });
}
