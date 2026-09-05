import { NextResponse } from "next/server";
import { callBackendApi } from "@/lib/api/backendClient";

export async function POST(request) {
  const requestDetails = await request.json();
  const { status, body } = await callBackendApi("/auth/reset-password", {
    method: "POST",
    body: requestDetails,
  });
  return NextResponse.json(body, { status });
}
