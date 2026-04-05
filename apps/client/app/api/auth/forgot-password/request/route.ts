import { NextResponse } from "next/server";

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL ?? "http://localhost:8081";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string } | null;

  if (!body?.email) {
    return NextResponse.json(
      { success: false, message: "Email is required.", payload: {} },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/auth/forgot-password/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = (await response.json().catch(() => null)) as
      | { success?: boolean; message?: string; payload?: Record<string, unknown> }
      | null;

    return NextResponse.json(
      data ?? { success: false, message: "Request failed.", payload: {} },
      { status: response.status },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Khong the ket noi den dich vu OTP.", payload: {} },
      { status: 502 },
    );
  }
}
