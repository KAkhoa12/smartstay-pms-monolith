"use client";

import { Suspense, type FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthNotice } from "@/components/auth/auth-notice";
import { Button } from "@/components/ui/button";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registeredEmail = searchParams.get("email") ?? "";
  const isRegistered = searchParams.get("registered") === "1";
  const isPasswordReset = searchParams.get("passwordReset") === "1";
  const [showRegisteredNotice, setShowRegisteredNotice] = useState(isRegistered);
  const [showPasswordResetNotice, setShowPasswordResetNotice] = useState(isPasswordReset);
  const [email, setEmail] = useState(registeredEmail);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (registeredEmail) {
      setEmail(registeredEmail);
    }
  }, [registeredEmail]);

  useEffect(() => {
    setShowRegisteredNotice(isRegistered);
  }, [isRegistered]);

  useEffect(() => {
    setShowPasswordResetNotice(isPasswordReset);
  }, [isPasswordReset]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      setErrorMessage("Vui long nhap email va mat khau.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password,
          deviceInfo: "SmartStay Web Client",
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | {
            success?: boolean;
            message?: string;
            payload?: {
              accessToken?: string;
              refreshToken?: string;
              user?: unknown;
            };
          }
        | null;

      if (!response.ok || !data?.success || !data?.payload?.accessToken || !data?.payload?.refreshToken) {
        setErrorMessage(data?.message ?? "Dang nhap that bai.");
        return;
      }

      window.localStorage.setItem("smartstay_access_token", data.payload.accessToken);
      window.localStorage.setItem("smartstay_refresh_token", data.payload.refreshToken);
      window.localStorage.setItem("smartstay_user", JSON.stringify(data.payload.user ?? null));

      router.push("/booking");
    } catch {
      setErrorMessage("Khong the dang nhap luc nay. Vui long thu lai.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="text-center text-[2.1rem] font-bold leading-tight text-slate-900">Dang nhap</h1>
      <p className="mt-5 max-w-[520px] text-[1.05rem] leading-8 text-slate-800">
        Dang nhap tai khoan SmartStay de tim kiem phong, dat phong va quan ly chuyen di cua ban.
      </p>

      <form className="mt-7" onSubmit={handleSubmit}>
        {showRegisteredNotice ? (
          <AuthNotice
            message="Dang ky thanh cong. Ban co the dang nhap ngay bay gio."
            variant="success"
            onClose={() => setShowRegisteredNotice(false)}
          />
        ) : null}

        {showPasswordResetNotice ? (
          <AuthNotice
            message="Doi mat khau thanh cong. Hay dang nhap bang mat khau moi."
            variant="success"
            onClose={() => setShowPasswordResetNotice(false)}
          />
        ) : null}

        {errorMessage ? (
          <AuthNotice message={errorMessage} variant="error" onClose={() => setErrorMessage("")} />
        ) : null}

        <label htmlFor="loginInput" className="mb-2 block text-[1.1rem] font-semibold text-slate-900">
          Dia chi email
        </label>
        <input
          id="loginInput"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Nhap dia chi email cua ban"
          className="h-13 w-full rounded-[8px] border-2 border-[#8fcad9] bg-white px-4 text-[1.03rem] text-slate-900 outline-none transition shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
        />

        <div className="mt-5">
          <label htmlFor="passwordInput" className="mb-2 block text-[1.1rem] font-semibold text-slate-900">
            Mat khau
          </label>
          <input
            id="passwordInput"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Nhap mat khau cua ban"
            className="h-13 w-full rounded-[8px] border-2 border-[#8fcad9] bg-white px-4 text-[1.03rem] text-slate-900 outline-none transition shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
          />
          <div className="mt-3 text-right">
            <Link href="/forgot-password" className="text-[1rem] font-medium text-[#5a9aac] hover:underline">
              Quen mat khau?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 h-14 w-full rounded-[6px] bg-[#006ce4] text-xl font-semibold text-white hover:bg-[#0059c2]"
        >
          {isSubmitting ? "Dang dang nhap..." : "Tiep tuc"}
        </Button>

        <div className="mt-4 text-center">
          <span className="text-[1rem] text-slate-700">Chua co tai khoan? </span>
          <Link href="/register" className="text-[1rem] font-semibold text-[#5a9aac] hover:underline">
            Dang ky
          </Link>
        </div>
      </form>

      <div className="my-9 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-300" />
        <p className="text-[1.05rem] text-slate-900">hoac su dung mot trong cac lua chon nay</p>
        <div className="h-px flex-1 bg-slate-300" />
      </div>

      <div className="mb-10 flex items-center justify-center gap-6">
        <button
          type="button"
          className="flex h-22 w-22 items-center justify-center rounded-[6px] border border-slate-300 bg-white text-[2.4rem] font-semibold text-[#ea4335] transition hover:border-slate-400"
          aria-label="Dang nhap bang Google"
        >
          G
        </button>
        <button
          type="button"
          className="flex h-22 w-22 items-center justify-center rounded-[6px] border border-slate-300 bg-white text-[2.4rem] font-semibold text-black transition hover:border-slate-400"
          aria-label="Dang nhap bang Apple"
        >
          A
        </button>
        <button
          type="button"
          className="flex h-22 w-22 items-center justify-center rounded-[6px] border border-slate-300 bg-white text-[2.4rem] font-bold text-[#1877f2] transition hover:border-slate-400"
          aria-label="Dang nhap bang Facebook"
        >
          f
        </button>
      </div>

      <div className="border-t border-slate-300 pt-6 text-center">
        <p className="mx-auto max-w-[540px] text-base leading-8 text-slate-900">
          Qua viec dang nhap hoac tao tai khoan, ban dong y voi cac{" "}
          <Link href="#" className="text-[#5a9aac] hover:underline">
            Dieu khoan va Dieu kien
          </Link>{" "}
          cung nhu{" "}
          <Link href="#" className="text-[#5a9aac] hover:underline">
            Chinh sach Bao mat
          </Link>{" "}
          cua chung toi
        </p>
        <p className="mt-5 text-[1.05rem]">Bao luu moi quyen.</p>
        <p className="mt-1 text-[1.05rem]">Ban quyen {new Date().getFullYear()} - SmartStay.com</p>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[320px]" />}>
      <LoginPageContent />
    </Suspense>
  );
}
