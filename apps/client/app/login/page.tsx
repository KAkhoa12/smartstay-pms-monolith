"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CircleHelp, Mail, Phone } from "lucide-react";

export default function LoginPage() {
  const [loginMode, setLoginMode] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const hotelSlides = [
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80",
  ];

  return (
    <main className="min-h-screen bg-[#f3f5f6] text-[#1a1a1a]">
      <header className="marina-header text-white shadow-[0_10px_24px_rgba(44,86,100,0.25)]">
        <div className="mx-auto flex h-21 w-full max-w-7xl items-center justify-between px-6 md:px-10">
          <Link href="/login" className="text-[2rem] font-semibold tracking-tight md:text-[2.1rem]">
            SmartStay.com
          </Link>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/45 text-base font-semibold"
              aria-label="Ngon ngu"
            >
              VN
            </button>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/45"
              aria-label="Tro giup"
            >
              <CircleHelp className="size-4" />
            </button>
          </div>
        </div>
      </header>

      <section className="grid min-h-[calc(100vh-84px)] lg:grid-cols-2">
        <div className="hotel-slider hidden lg:block">
          {hotelSlides.map((slide, index) => (
            <div
              key={slide}
              className="hotel-slide"
              style={{
                backgroundImage: `url("${slide}")`,
                animationDelay: `${index * 4}s`,
              }}
            />
          ))}
          <div className="hotel-slide-overlay" />
        </div>

        <div className="flex items-start px-5 pb-16 pt-8 md:px-8 md:pt-10 lg:justify-end lg:px-12 xl:px-16">
          <div className="w-full max-w-[560px]">
            <h1 className="text-center text-[2.1rem] font-bold leading-tight text-slate-900">Dang nhap</h1>
            <p className="mt-5 max-w-[520px] text-[1.05rem] leading-8 text-slate-800">
              Ban co the dang nhap tai khoan SmartStay cua minh de truy cap cac dich vu quan ly khach san.
            </p>

            <form className="mt-7">
              <label htmlFor="loginInput" className="mb-2 block text-[1.1rem] font-semibold text-slate-900">
                {loginMode === "email" ? "Dia chi email" : "So dien thoai"}
              </label>
              <div className="flex items-center gap-2">
                {loginMode === "email" ? (
                  <input
                    id="loginInput"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Nhap dia chi email cua ban"
                    className="h-13 flex-1 rounded-[8px] border-2 border-[#8fcad9] bg-white px-4 text-[1.03rem] text-slate-900 outline-none transition shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
                  />
                ) : (
                  <div className="flex h-13 flex-1 overflow-hidden rounded-[8px] border-2 border-[#8fcad9] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]">
                    <div className="flex w-[12.5%] min-w-[56px] items-center justify-center text-[1.03rem] font-semibold text-slate-900">
                      +84
                    </div>
                    <div className="w-px bg-slate-300/70" />
                    <input
                      id="loginInput"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value.replace(/\D/g, ""))}
                      placeholder="Nhap so dien thoai"
                      className="h-full flex-1 bg-white px-4 text-[1.03rem] text-slate-900 outline-none"
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setLoginMode((mode) => (mode === "email" ? "phone" : "email"))}
                  aria-label={loginMode === "email" ? "Chuyen sang dang nhap bang so dien thoai" : "Chuyen sang dang nhap bang email"}
                  className="flex h-13 w-13 items-center justify-center rounded-[8px] border border-slate-300 bg-white text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                >
                  {loginMode === "email" ? <Phone className="size-5" /> : <Mail className="size-5" />}
                </button>
              </div>

              <Button
                type="submit"
                className="mt-5 h-14 w-full rounded-[6px] bg-[#006ce4] text-xl font-semibold text-white hover:bg-[#0059c2]"
              >
                Tiep tuc
              </Button>
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
                <Link href="#" className="text-[#006ce4] hover:underline">
                  Dieu khoan va Dieu kien
                </Link>{" "}
                cung nhu{" "}
                <Link href="#" className="text-[#006ce4] hover:underline">
                  Chinh sach Bao mat
                </Link>{" "}
                cua chung toi
              </p>
              <p className="mt-5 text-[1.05rem]">Bao luu moi quyen.</p>
              <p className="mt-1 text-[1.05rem]">Ban quyen {new Date().getFullYear()} - SmartStay.com</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
