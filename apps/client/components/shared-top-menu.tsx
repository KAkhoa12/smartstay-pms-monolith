"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BedDouble, Building2, Car, Hotel, LogIn, Plane } from "lucide-react";

const navItems = [
  { href: "/booking", label: "Dat phong", icon: BedDouble },
  { href: "/flights", label: "Chuyen bay", icon: Plane },
  { href: "/flight-hotel", label: "Chuyen bay + Khach san", icon: Hotel },
  { href: "/car-rental", label: "Thue xe", icon: Car },
  { href: "/airport-taxi", label: "Taxi san bay", icon: Car },
];

const getMenuItemClassName = (pathname: string, href: string) => {
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return `inline-flex items-center gap-1.5 rounded-full px-3 py-2 transition-all duration-200 ${
    isActive
      ? "rounded-[999px] border border-[#9ec4d0] bg-gradient-to-b from-[#dff0f5] via-[#c9e5ee] to-[#b6d7e3] text-[#3d7283] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(79,127,143,0.32),0_10px_18px_rgba(63,113,128,0.28)] -translate-y-[1px]"
      : "text-slate-600 hover:-translate-y-[1px] hover:rounded-full hover:bg-gradient-to-b hover:from-white hover:to-[#edf4f7] hover:text-[#5a9aac] hover:shadow-[0_6px_14px_rgba(63,113,128,0.16)]"
  }`;
};

type SharedTopMenuProps = {
  compact?: boolean;
};

export default function SharedTopMenu({ compact = false }: SharedTopMenuProps) {
  const pathname = usePathname();

  return (
    <header className="fixed left-0 right-0 top-0 z-[60] border-t-4 border-[#8cc9d8] bg-white/92 shadow-[0_8px_22px_rgba(47,93,109,0.18)] transition-all duration-300">
      <div className={`mx-auto flex w-full max-w-6xl items-center justify-between px-4 transition-all duration-300 ${compact ? "py-2" : "py-3"}`}>
        <div className="flex items-center gap-8">
          <div className={`flex items-center justify-center rounded-sm bg-gradient-to-b from-[#8ecad8] to-[#5da7bb] text-white shadow-[0_10px_18px_rgba(78,131,149,0.38)] transition-all duration-300 ${compact ? "h-10 w-10" : "h-12 w-12"}`}>
            <Building2 className={`${compact ? "size-5" : "size-6"}`} />
          </div>
          <nav className="hidden items-center gap-2 text-xs md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={getMenuItemClassName(pathname, item.href)}>
                <item.icon className="size-3.5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="hidden items-center gap-2 text-xs md:flex">
          <Link
            href="/login"
            className={`inline-flex items-center gap-1.5 rounded-full bg-[#d8ecf3] px-5 text-sm font-semibold text-[#2d6f86] transition hover:-translate-y-[1px] hover:bg-[#cce5ef] ${compact ? "h-9" : "h-10"}`}
          >
            <span>Dang nhap</span>
            <LogIn className="size-4" />
          </Link>
          <Link
            href="/register"
            className={`inline-flex items-center rounded-full bg-[#2e9ed8] px-5 text-sm font-semibold text-white shadow-[0_8px_14px_rgba(56,142,184,0.25)] transition hover:-translate-y-[1px] hover:bg-[#238fc9] ${compact ? "h-9" : "h-10"}`}
          >
            Dang ky
          </Link>
        </div>
      </div>
    </header>
  );
}
