"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const isAuthFlowPath = (pathname: string) =>
  pathname === "/login" ||
  pathname === "/register" ||
  pathname === "/forgot-password" ||
  pathname.startsWith("/forgot-password/");

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

    const previousPath = window.sessionStorage.getItem("auth:last-path") ?? "";
    const isPreviousAuthFlowPath = isAuthFlowPath(previousPath);
    const isCurrentAuthFlowPath = isAuthFlowPath(pathname);

    if (!isPreviousAuthFlowPath || !isCurrentAuthFlowPath || previousPath === pathname) {
      return "fade";
    }

    if (pathname === "/login" && previousPath !== "/login") {
      return "right";
    }

    return "left";
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
