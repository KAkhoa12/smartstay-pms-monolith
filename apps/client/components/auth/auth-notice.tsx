"use client";

import { useEffect, useRef } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

type AuthNoticeProps = {
  message: string;
  variant?: "success" | "error" | "info";
  onClose?: () => void;
  autoDismissMs?: number;
};

const noticeStyles = {
  success: {
    wrapper: "border-[#b9e6c5] bg-[#f2fbf5] text-[#16643b] shadow-[0_12px_24px_rgba(22,100,59,0.08)]",
    icon: "text-[#1f8f52]",
  },
  error: {
    wrapper: "border-[#f2c1c1] bg-[#fff6f6] text-[#a33a3a] shadow-[0_12px_24px_rgba(163,58,58,0.08)]",
    icon: "text-[#cf4a4a]",
  },
  info: {
    wrapper: "border-[#c8d9f2] bg-[#f5f9ff] text-[#305f9e] shadow-[0_12px_24px_rgba(48,95,158,0.08)]",
    icon: "text-[#3f7ed1]",
  },
} as const;

export function AuthNotice({
  message,
  variant = "info",
  onClose,
  autoDismissMs = 5000,
}: AuthNoticeProps) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!onCloseRef.current || autoDismissMs <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      onCloseRef.current?.();
    }, autoDismissMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [autoDismissMs, message]);

  const Icon = variant === "success" ? CheckCircle2 : variant === "error" ? AlertCircle : Info;
  const styles = noticeStyles[variant];

  return (
    <div className={`mb-4 flex items-start gap-3 rounded-[12px] border px-4 py-3.5 text-sm leading-6 transition ${styles.wrapper}`}>
      <Icon className={`mt-0.5 size-4 shrink-0 ${styles.icon}`} />
      <p>{message}</p>
    </div>
  );
}
