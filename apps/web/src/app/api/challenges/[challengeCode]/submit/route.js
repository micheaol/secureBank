import { forwardAuthenticatedBackendRequest } from "@/lib/session/forwardAuthenticatedBackendRequest";

export async function POST(request, context) {
  const { challengeCode } = await context.params;
  const submissionDetails = await request.json();
  return forwardAuthenticatedBackendRequest(request, `/challenges/${challengeCode}/submit`, {
    method: "POST",
    body: submissionDetails,
  });
}
