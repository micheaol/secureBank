import { forwardAuthenticatedBackendRequest } from "@/lib/session/forwardAuthenticatedBackendRequest";

export async function GET(request) {
  return forwardAuthenticatedBackendRequest(request, "/beneficiaries");
}

export async function POST(request) {
  const beneficiaryDetails = await request.json();
  return forwardAuthenticatedBackendRequest(request, "/beneficiaries", {
    method: "POST",
    body: beneficiaryDetails,
  });
}
