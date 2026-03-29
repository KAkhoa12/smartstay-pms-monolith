"use client";

import type { CSSProperties, ReactNode } from "react";

export const DROPDOWN_GLASS_OPACITY = 0.6;

type DropdownPanelProps = {
  className: string;
  children: ReactNode;
  style?: CSSProperties;
};

export default function DropdownPanel({ className, children, style }: DropdownPanelProps) {
  const panelStyle: CSSProperties = {
    backgroundColor: `rgba(255,255,255,${DROPDOWN_GLASS_OPACITY})`,
    borderColor: `rgba(255,255,255,${Math.min(0.9, DROPDOWN_GLASS_OPACITY + 0.12)})`,
    ...style,
  };

  return (
    <div
      className={`${className} rounded-md border shadow-[0_14px_28px_rgba(16,35,52,0.25)] backdrop-blur-md`}
      style={panelStyle}
    >
      {children}
    </div>
  );
}
