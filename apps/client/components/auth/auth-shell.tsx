"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { CircleHelp } from "lucide-react";

type AuthShellProps = {
  children: ReactNode;
};

const hotelSlides = [
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80",
];

export function AuthShell({ children }: AuthShellProps) {
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

        <div className="flex items-start justify-center px-5 pb-16 pt-10 md:px-8 md:pt-12 lg:px-12 xl:px-16">
          <div className="w-full max-w-[560px]">{children}</div>
        </div>
      </section>
    </main>
  );
}
