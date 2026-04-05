"use client";

import { type ChangeEvent, type ClipboardEvent, type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthNotice } from "@/components/auth/auth-notice";
import { Button } from "@/components/ui/button";

type ForgotPasswordVerifyClientProps = {
  email: string;
  otpPreview: string;
};

export default function ForgotPasswordVerifyClient({
  email,
  otpPreview,
}: ForgotPasswordVerifyClientProps) {
  const router = useRouter();
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const maskedEmail = useMemo(() => {
    if (!email.includes("@")) return email;
    const [name, domain] = email.split("@");
    if (name.length <= 2) return `${name[0] ?? ""}***@${domain}`;
    return `${name.slice(0, 2)}***@${domain}`;
  }, [email]);

  const otp = otpDigits.join("");
  const canSubmitOtp = otp.length === 6 && !isSubmitting;

  useEffect(() => {
    if (isOtpVerified || resendCountdown <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setResendCountdown((previous) => Math.max(previous - 1, 0));
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isOtpVerified, resendCountdown]);

  const focusOtpInput = (index: number) => {
    otpInputRefs.current[index]?.focus();
    otpInputRefs.current[index]?.select();
  };

  const handleOtpChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const digits = event.target.value.replace(/\D/g, "");

    if (!digits) {
      setOtpDigits((previous) => {
        const next = [...previous];
        next[index] = "";
        return next;
      });
      return;
    }

    setOtpDigits((previous) => {
      const next = [...previous];
      const nextDigits = digits.slice(0, 6 - index).split("");

      nextDigits.forEach((digit, offset) => {
        next[index + offset] = digit;
      });

      return next;
    });

    const nextIndex = Math.min(index + digits.length, 5);
    focusOtpInput(nextIndex);
  };

  const handleOtpKeyDown = (index: number, key: string) => {
    if (key === "Backspace" && !otpDigits[index] && index > 0) {
      focusOtpInput(index - 1);
      return;
    }

    if (key === "ArrowLeft" && index > 0) {
      focusOtpInput(index - 1);
      return;
    }

    if (key === "ArrowRight" && index < 5) {
      focusOtpInput(index + 1);
    }
  };

  const handleOtpPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pastedDigits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedDigits) return;

    event.preventDefault();
    const next = Array(6).fill("");
    pastedDigits.split("").forEach((digit, index) => {
      next[index] = digit;
    });
    setOtpDigits(next);
    focusOtpInput(Math.min(pastedDigits.length - 1, 5));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      setErrorMessage("Khong tim thay email can xac thuc.");
      return;
    }

    if (otp.length !== 6) {
      setErrorMessage("Vui long nhap OTP.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.trim() }),
      });

      const data = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string }
        | null;

      if (!response.ok || !data?.success) {
        setErrorMessage(data?.message ?? "OTP khong hop le.");
        return;
      }

      setIsOtpVerified(true);
      setSuccessMessage("Xac thuc OTP thanh cong. Hay nhap mat khau moi.");
    } catch {
      setErrorMessage("Khong the xac thuc OTP luc nay. Vui long thu lai.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newPassword || !confirmPassword) {
      setErrorMessage("Vui long nhap day du mat khau moi.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Mat khau xac nhan khong khop.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.trim(), newPassword }),
      });

      const data = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string }
        | null;

      if (!response.ok || !data?.success) {
        setErrorMessage(data?.message ?? "Khong the doi mat khau.");
        return;
      }

      setSuccessMessage("Doi mat khau thanh cong. Dang quay lai trang dang nhap...");
      window.setTimeout(() => {
        router.push(`/login?email=${encodeURIComponent(email)}&passwordReset=1`);
      }, 1200);
    } catch {
      setErrorMessage("Khong the doi mat khau luc nay. Vui long thu lai.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email || isResendingOtp) {
      return;
    }

    setIsResendingOtp(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string; payload?: { otpPreview?: string } }
        | null;

      if (!response.ok || !data?.success) {
        setErrorMessage(data?.message ?? "Khong the gui lai OTP.");
        return;
      }

      setOtpDigits(Array(6).fill(""));
      setResendCountdown(60);
      setSuccessMessage(
        data.payload?.otpPreview
          ? `Da gui lai OTP. OTP dev preview: ${data.payload.otpPreview}`
          : "Da gui lai OTP. Vui long kiem tra email cua ban.",
      );
      window.setTimeout(() => {
        focusOtpInput(0);
      }, 0);
    } catch {
      setErrorMessage("Khong the gui lai OTP luc nay. Vui long thu lai.");
    } finally {
      setIsResendingOtp(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-[440px]">
        <h1 className="text-left text-[2.1rem] font-bold leading-tight text-slate-900">Nhap ma OTP</h1>
        <p className="mt-5 text-left text-[1.05rem] leading-8 text-slate-800">
          Chung toi da gui ma OTP den <span className="font-semibold">{maskedEmail || "email cua ban"}</span>.
          Vui long nhap ma nay de tiep tuc.
        </p>

        {!isOtpVerified ? <form className="mt-7" onSubmit={handleSubmit}>
          {errorMessage ? (
            <AuthNotice message={errorMessage} variant="error" onClose={() => setErrorMessage("")} />
          ) : null}

          {successMessage ? (
            <AuthNotice message={successMessage} variant="success" onClose={() => setSuccessMessage("")} />
          ) : null}

          {otpPreview ? (
            <AuthNotice message={`OTP dev preview: ${otpPreview}`} variant="info" />
          ) : null}

          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {otpDigits.map((digit, index) => (
              <input
                key={`otp-digit-${index}`}
                ref={(element) => {
                  otpInputRefs.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                maxLength={6}
                value={digit}
                onChange={(event) => handleOtpChange(index, event)}
                onKeyDown={(event) => handleOtpKeyDown(index, event.key)}
                onPaste={handleOtpPaste}
                className="h-15 w-12 rounded-[8px] border border-slate-400 bg-white text-center text-[1.4rem] font-semibold text-slate-900 outline-none transition focus:border-[#0b63c8] focus:ring-2 focus:ring-[#0b63c8]/15 sm:h-16 sm:w-14"
              />
            ))}
          </div>

          <Button
            type="submit"
            disabled={!canSubmitOtp}
            className="mt-5 h-14 w-full rounded-[6px] bg-[#006ce4] text-xl font-semibold text-white hover:bg-[#0059c2] disabled:bg-slate-300 disabled:text-slate-500"
          >
            {isSubmitting ? "Dang xac thuc..." : "Xac thuc OTP"}
          </Button>

          <div className="mt-5 text-center text-[0.98rem] leading-7 text-slate-800">
            Ban chua nhan duoc email? Vui long kiem tra muc thu rac{" "}
            {resendCountdown > 0 ? (
              <>
                hoac yeu cau ma khac trong <span className="font-semibold">{resendCountdown} giay</span>
              </>
            ) : (
              <>
                hoac{" "}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResendingOtp}
                  className="font-semibold text-[#5a9aac] transition hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isResendingOtp ? "dang gui lai OTP" : "gui lai OTP"}
                </button>
              </>
            )}
            .
          </div>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-[1.05rem] font-semibold text-[#0b63c8] hover:underline"
            >
              Quay lai trang dang nhap
            </button>
          </div>
        </form> : (
          <form className="mt-7" onSubmit={handleResetPassword}>
            {errorMessage ? (
              <AuthNotice message={errorMessage} variant="error" onClose={() => setErrorMessage("")} />
            ) : null}

            {successMessage ? (
              <AuthNotice message={successMessage} variant="success" onClose={() => setSuccessMessage("")} />
            ) : null}

            <label htmlFor="newPasswordInput" className="mb-2 block text-[1.1rem] font-semibold text-slate-900">
              Mat khau moi
            </label>
            <input
              id="newPasswordInput"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Nhap mat khau moi"
              className="h-13 w-full rounded-[8px] border-2 border-[#8fcad9] bg-white px-4 text-[1.03rem] text-slate-900 outline-none transition shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
            />

            <label htmlFor="confirmPasswordInput" className="mb-2 mt-5 block text-[1.1rem] font-semibold text-slate-900">
              Xac nhan mat khau moi
            </label>
            <input
              id="confirmPasswordInput"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Nhap lai mat khau moi"
              className="h-13 w-full rounded-[8px] border-2 border-[#8fcad9] bg-white px-4 text-[1.03rem] text-slate-900 outline-none transition shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-5 h-14 w-full rounded-[6px] bg-[#006ce4] text-xl font-semibold text-white hover:bg-[#0059c2]"
            >
              {isSubmitting ? "Dang doi mat khau..." : "Doi mat khau"}
            </Button>
          </form>
        )}
      </div>
    </>
  );
}
