import { performCredentialExchangeAndRespond } from "@/lib/session/sessionExchange";

export async function POST(request) {
  const registrationDetails = await request.json();
  return performCredentialExchangeAndRespond("/auth/register", registrationDetails);
}
