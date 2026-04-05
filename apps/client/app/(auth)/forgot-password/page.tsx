"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthNotice } from "@/components/auth/auth-notice";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [helperMessage, setHelperMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setHelperMessage("");
      setErrorMessage("Vui long nhap email.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setHelperMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const data = (await response.json().catch(() => null)) as
        | {
            success?: boolean;
            message?: string;
            payload?: { otpPreview?: string };
          }
        | null;

      if (!response.ok || !data?.success) {
        setErrorMessage(data?.message ?? "Khong the gui OTP.");
        return;
      }

      const otpPreview = data.payload?.otpPreview;
      if (otpPreview) {
        setHelperMessage(`OTP dev preview: ${otpPreview}`);
      }

      router.push(`/forgot-password/verify?email=${encodeURIComponent(normalizedEmail)}${otpPreview ? `&otpPreview=${encodeURIComponent(otpPreview)}` : ""}`);
    } catch {
      setErrorMessage("Khong the gui OTP luc nay. Vui long thu lai.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="text-center text-[2.1rem] font-bold leading-tight text-slate-900">Quen mat khau</h1>
      <p className="mt-5 max-w-[520px] text-[1.05rem] leading-8 text-slate-800">
        Nhap dia chi email da dang ky. Chung toi se gui ma OTP de ban xac thuc.
      </p>

      <form className="mt-7" onSubmit={handleSubmit}>
        {errorMessage ? (
          <AuthNotice message={errorMessage} variant="error" onClose={() => setErrorMessage("")} />
        ) : null}

        {helperMessage ? (
          <AuthNotice message={helperMessage} variant="success" onClose={() => setHelperMessage("")} />
        ) : null}

        <label htmlFor="emailInput" className="mb-2 block text-[1.1rem] font-semibold text-slate-900">
          Dia chi email
        </label>
        <input
          id="emailInput"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Nhap dia chi email cua ban"
          className="h-13 w-full rounded-[8px] border-2 border-[#8fcad9] bg-white px-4 text-[1.03rem] text-slate-900 outline-none transition shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 h-14 w-full rounded-[6px] bg-[#006ce4] text-xl font-semibold text-white hover:bg-[#0059c2]"
        >
          {isSubmitting ? "Dang gui OTP..." : "Gui ma OTP"}
        </Button>

        <div className="mt-4 text-center">
          <Link href="/login" className="text-[1rem] font-semibold text-[#5a9aac] hover:underline">
            Quay lai dang nhap
          </Link>
        </div>
      </form>
    </>
  );
}
