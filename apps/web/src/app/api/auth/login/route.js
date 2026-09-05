import { performCredentialExchangeAndRespond } from "@/lib/session/sessionExchange";

export async function POST(request) {
  const loginCredentials = await request.json();
  return performCredentialExchangeAndRespond("/auth/login", loginCredentials);
}
