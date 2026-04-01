"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AuthTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const direction: "left" | "right" | "fade" = (() => {
    if (typeof window === "undefined") {
      return "fade";
    }

    const previousPath = window.sessionStorage.getItem("auth:last-path");
    if (previousPath === "/login" && pathname === "/register") {
      return "left";
    }

    if (previousPath === "/register" && pathname === "/login") {
      return "right";
    }

    return "fade";
  })();

  useEffect(() => {
    window.sessionStorage.setItem("auth:last-path", pathname);
  }, [pathname]);

  return (
    <div key={pathname} className={`auth-panel-transition auth-panel-transition-${direction}`}>
      {children}
    </div>
  );
}
