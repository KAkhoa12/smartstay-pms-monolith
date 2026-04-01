"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BedDouble, Building2, Car, Hotel, LogIn, Plane } from "lucide-react";

const navItems = [
  { href: "/booking", label: "Dat phong", icon: BedDouble },
  { href: "/flights", label: "Chuyen bay", icon: Plane },
  { href: "/flight-hotel", label: "Chuyen bay + Khach san", icon: Hotel },
  { href: "/car-rental", label: "Thue xe", icon: Car },
  { href: "/airport-taxi", label: "Taxi san bay", icon: Car },
];

const EXPANDED_HEIGHT = 70;
const COMPACT_HEIGHT = 58;
const SCROLL_COMPACT_THRESHOLD = 96;
const SCROLL_HYSTERESIS = 24;

type SharedTopMenuProps = {
  compact?: boolean;
  fixed?: boolean;
  autoCompact?: boolean;
};

const getMenuItemClassName = (pathname: string, href: string, isCompact: boolean) => {
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return [
    `relative z-[1] inline-flex items-center rounded-full font-medium transition-all duration-300 ${
      isCompact ? "h-8 gap-1 px-3 text-[13px]" : "h-10 gap-1.5 px-3.5 text-sm"
    }`,
    isActive
      ? "text-[#2e7086]"
      : "text-slate-600 hover:bg-[#eef7fa] hover:text-[#2e7086]",
  ].join(" ");
};

export default function SharedTopMenu({ compact = false, fixed = false, autoCompact = true }: SharedTopMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(compact);
  const [activePillStyle, setActivePillStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const frameRef = useRef<number | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const isCompact = compact || isScrolled;

  const activeNavItem = navItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));

  const navigateWithTransition = (href: string) => {
    if (pathname === href) return;

    document.body.classList.add("page-transitioning");
    window.setTimeout(() => {
      router.push(href);
    }, 80);
  };

  useEffect(() => {
    const syncMenuHeight = () => {
      setIsScrolled((previous) => {
        const nextCompact = compact
          ? true
          : !autoCompact
            ? false
          : previous
            ? window.scrollY > SCROLL_COMPACT_THRESHOLD - SCROLL_HYSTERESIS
            : window.scrollY > SCROLL_COMPACT_THRESHOLD + SCROLL_HYSTERESIS;

        return nextCompact;
      });
    };

    const handleScroll = () => {
      if (frameRef.current !== null) return;

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        syncMenuHeight();
      });
    };

    syncMenuHeight();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [compact, autoCompact]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--shared-top-menu-height",
      `${isCompact ? COMPACT_HEIGHT : EXPANDED_HEIGHT}px`,
    );
  }, [isCompact]);

  useLayoutEffect(() => {
    const updateActivePill = () => {
      const activeHref = activeNavItem?.href;
      const activeElement = activeHref ? itemRefs.current[activeHref] : null;
      const navElement = navRef.current;

      if (!activeElement || !navElement) {
        setActivePillStyle((previous) => ({ ...previous, opacity: 0 }));
        return;
      }

      setActivePillStyle({
        left: activeElement.offsetLeft,
        width: activeElement.offsetWidth,
        opacity: 1,
      });
    };

    updateActivePill();
    window.addEventListener("resize", updateActivePill);

    return () => {
      window.removeEventListener("resize", updateActivePill);
    };
  }, [activeNavItem?.href, isCompact]);

  return (
    <header
      className={`${fixed ? "fixed left-0 right-0 top-0 z-[140]" : "sticky top-0 z-[70]"} border-t-4 border-[#8cc9d8] bg-white/95 backdrop-blur-md transition-[box-shadow,background-color] duration-300 ${
        isCompact
          ? "shadow-[0_6px_18px_rgba(47,93,109,0.12)]"
          : "shadow-[0_8px_24px_rgba(47,93,109,0.16)]"
      }`}
    >
      <div
        className={`mx-auto flex w-full max-w-6xl items-center justify-between px-4 transition-[height,padding,gap] duration-300 ${
          isCompact ? "h-[58px]" : "h-[70px]"
        }`}
      >
        <div className={`flex items-center transition-[gap] duration-300 ${isCompact ? "gap-3 lg:gap-6" : "gap-4 lg:gap-8"}`}>
          <Link
            href="/booking"
            aria-label="SmartStay"
            onClick={(event) => {
              event.preventDefault();
              navigateWithTransition("/booking");
            }}
            className={`flex items-center justify-center bg-gradient-to-b from-[#8ecad8] to-[#5da7bb] text-white shadow-[0_10px_18px_rgba(78,131,149,0.32)] transition-all duration-300 ${
              isCompact ? "h-9 w-9 rounded-lg" : "h-11 w-11 rounded-xl"
            }`}
          >
            <Building2 className={`transition-all duration-300 ${isCompact ? "size-[18px]" : "size-[22px]"}`} />
          </Link>

          <nav ref={navRef} className="relative hidden items-center gap-2 md:flex">
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-full border border-[#99c6d4] bg-gradient-to-b from-[#e4f4f8] via-[#d1ebf2] to-[#bddfe9] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_16px_rgba(67,116,132,0.18)] transition-[left,width,opacity,height] duration-300 ${
                isCompact ? "h-8" : "h-10"
              }`}
              style={activePillStyle}
            />
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                ref={(element) => {
                  itemRefs.current[item.href] = element;
                }}
                onClick={(event) => {
                  event.preventDefault();
                  navigateWithTransition(item.href);
                }}
                className={getMenuItemClassName(pathname, item.href, isCompact)}
              >
                <item.icon className={`transition-all duration-300 ${isCompact ? "size-[13px]" : "size-4"}`} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className={`hidden items-center md:flex transition-[gap] duration-300 ${isCompact ? "gap-2" : "gap-3"}`}>
          <Link
            href="/login"
            onClick={(event) => {
              event.preventDefault();
              navigateWithTransition("/login");
            }}
            className={`inline-flex items-center gap-1.5 rounded-full bg-[#d8ecf3] font-semibold text-[#2d6f86] transition-all duration-300 hover:bg-[#cce5ef] ${
              isCompact ? "h-9 px-4 text-[13px]" : "h-10 px-5 text-sm"
            }`}
          >
            <span>Dang nhap</span>
            <LogIn className={`transition-all duration-300 ${isCompact ? "size-3.5" : "size-4"}`} />
          </Link>
          <Link
            href="/register"
            onClick={(event) => {
              event.preventDefault();
              navigateWithTransition("/register");
            }}
            className={`inline-flex items-center rounded-full bg-[#2e9ed8] font-semibold text-white shadow-[0_8px_14px_rgba(56,142,184,0.22)] transition-all duration-300 hover:bg-[#238fc9] ${
              isCompact ? "h-9 px-4 text-[13px]" : "h-10 px-5 text-sm"
            }`}
          >
            Dang ky
          </Link>
        </div>
      </div>
    </header>
  );
}
