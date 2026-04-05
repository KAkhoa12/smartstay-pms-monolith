import { NextResponse } from "next/server";

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL ?? "http://localhost:8081";

type LoginPayload = {
  email?: string;
  password?: string;
  deviceInfo?: string;
  ipAddress?: string;
};

type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  payload?: T;
};

export async function POST(request: Request) {
  let body: LoginPayload;

  try {
    body = (await request.json()) as LoginPayload;
  } catch {
    return NextResponse.json({ success: false, message: "Du lieu gui len khong hop le.", payload: {} }, { status: 400 });
  }

  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/auth/login/customer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = (await response.json().catch(() => null)) as ApiResponse<Record<string, unknown>> | null;

    if (!response.ok) {
      const message = typeof data?.message === "string" ? data.message : "Dang nhap that bai.";

      return NextResponse.json({ success: false, message, payload: {} }, { status: response.status });
    }

    return NextResponse.json(data ?? { success: true, message: "Dang nhap thanh cong.", payload: {} }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Khong the ket noi den dich vu dang nhap. Vui long thu lai.", payload: {} },
      { status: 502 },
    );
  }
}
