import { forwardAuthenticatedBackendRequest } from "@/lib/session/forwardAuthenticatedBackendRequest";

export async function GET(request) {
  const queryString = request.nextUrl.search;
  return forwardAuthenticatedBackendRequest(request, `/admin/audit-log${queryString}`);
}
