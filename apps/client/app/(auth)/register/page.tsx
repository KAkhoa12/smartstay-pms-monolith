"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthNotice } from "@/components/auth/auth-notice";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhoneNumber = phoneNumber.trim();

    if (!trimmedFullName || !trimmedEmail || !password || !confirmPassword) {
      setSuccessMessage("");
      setErrorMessage("Vui long nhap day du thong tin.");
      return;
    }

    if (password !== confirmPassword) {
      setSuccessMessage("");
      setErrorMessage("Mat khau xac nhan khong khop.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: trimmedFullName,
          email: trimmedEmail,
          phoneNumber: trimmedPhoneNumber,
          password,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | {
            success?: boolean;
            message?: string;
            payload?: unknown;
          }
        | null;

      if (!response.ok || !data?.success) {
        setErrorMessage(data?.message ?? "Dang ky that bai.");
        return;
      }

      setSuccessMessage("Dang ky thanh cong. Dang chuyen ban den trang dang nhap...");
      setFullName("");
      setPhoneNumber("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      window.setTimeout(() => {
        router.push(`/login?registered=1&email=${encodeURIComponent(trimmedEmail)}`);
      }, 900);
    } catch {
      setErrorMessage("Khong the tao tai khoan luc nay. Vui long thu lai.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="text-center text-[2.1rem] font-bold leading-tight text-slate-900">Dang ky</h1>
      <p className="mt-5 max-w-[520px] text-[1.05rem] leading-8 text-slate-800">
        Tao tai khoan SmartStay de tim kiem phong, dat phong nhanh va theo doi chuyen di cua ban.
      </p>

      <form className="mt-7" onSubmit={handleSubmit}>
        {errorMessage ? (
          <AuthNotice message={errorMessage} variant="error" onClose={() => setErrorMessage("")} />
        ) : null}

        {successMessage ? (
          <AuthNotice message={successMessage} variant="success" onClose={() => setSuccessMessage("")} />
        ) : null}

        <div>
          <label htmlFor="fullNameInput" className="mb-2 block text-[1.1rem] font-semibold text-slate-900">
            Ho va ten
          </label>
          <input
            id="fullNameInput"
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Nhap ho va ten cua ban"
            className="h-13 w-full rounded-[8px] border-2 border-[#8fcad9] bg-white px-4 text-[1.03rem] text-slate-900 outline-none transition shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
          />
        </div>

        <div className="mt-5">
          <label htmlFor="phoneNumberInput" className="mb-2 block text-[1.1rem] font-semibold text-slate-900">
            So dien thoai
          </label>
          <input
            id="phoneNumberInput"
            type="tel"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            placeholder="Nhap so dien thoai cua ban"
            className="h-13 w-full rounded-[8px] border-2 border-[#8fcad9] bg-white px-4 text-[1.03rem] text-slate-900 outline-none transition shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
          />
        </div>

        <div className="mt-5">
          <label htmlFor="registerInput" className="mb-2 block text-[1.1rem] font-semibold text-slate-900">
            Dia chi email
          </label>
          <input
            id="registerInput"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Nhap dia chi email cua ban"
            className="h-13 w-full rounded-[8px] border-2 border-[#8fcad9] bg-white px-4 text-[1.03rem] text-slate-900 outline-none transition shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
          />
        </div>

        <div className="mt-5">
          <label htmlFor="registerPasswordInput" className="mb-2 block text-[1.1rem] font-semibold text-slate-900">
            Mat khau
          </label>
          <input
            id="registerPasswordInput"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Nhap mat khau cua ban"
            className="h-13 w-full rounded-[8px] border-2 border-[#8fcad9] bg-white px-4 text-[1.03rem] text-slate-900 outline-none transition shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
          />
        </div>

        <div className="mt-5">
          <label htmlFor="confirmPasswordInput" className="mb-2 block text-[1.1rem] font-semibold text-slate-900">
            Xac nhan mat khau
          </label>
          <input
            id="confirmPasswordInput"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Nhap lai mat khau"
            className="h-13 w-full rounded-[8px] border-2 border-[#8fcad9] bg-white px-4 text-[1.03rem] text-slate-900 outline-none transition shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 h-14 w-full rounded-[6px] bg-[#006ce4] text-xl font-semibold text-white hover:bg-[#0059c2]"
        >
          {isSubmitting ? "Dang tao tai khoan..." : "Tao tai khoan"}
        </Button>

        <div className="mt-4 text-center">
          <span className="text-[1rem] text-slate-700">Da co tai khoan? </span>
          <Link href="/login" className="text-[1rem] font-semibold text-[#5a9aac] hover:underline">
            Dang nhap
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
          aria-label="Dang ky bang Google"
        >
          G
        </button>
        <button
          type="button"
          className="flex h-22 w-22 items-center justify-center rounded-[6px] border border-slate-300 bg-white text-[2.4rem] font-semibold text-black transition hover:border-slate-400"
          aria-label="Dang ky bang Apple"
        >
          A
        </button>
        <button
          type="button"
          className="flex h-22 w-22 items-center justify-center rounded-[6px] border border-slate-300 bg-white text-[2.4rem] font-bold text-[#1877f2] transition hover:border-slate-400"
          aria-label="Dang ky bang Facebook"
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
