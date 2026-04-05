"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type PageTransitionProps = Readonly<{
  children: React.ReactNode;
  className?: string;
}>;

export default function PageTransition({ children, className = "" }: PageTransitionProps) {
  const pathname = usePathname();
  const transitionKey = pathname;
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    document.body.classList.remove("page-transitioning");
  }, [transitionKey]);

  return (
    <div key={transitionKey} className={`${isAuthRoute ? "" : "page-transition"} ${className}`.trim()}>
      {children}
    </div>
  );
}
