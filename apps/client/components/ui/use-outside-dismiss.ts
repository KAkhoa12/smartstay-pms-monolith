"use client";

import { type RefObject, useEffect } from "react";

type UseOutsideDismissOptions = {
  containerRef: RefObject<HTMLElement | null>;
  isActive: boolean;
  onDismiss: () => void;
};

export default function useOutsideDismiss({
  containerRef,
  isActive,
  onDismiss,
}: UseOutsideDismissOptions) {
  useEffect(() => {
    if (!isActive) return;

    const handlePointerDown = (event: PointerEvent) => {
      const container = containerRef.current;
      const target = event.target;

      if (!container || !(target instanceof Node)) return;
      if (container.contains(target)) return;

      onDismiss();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onDismiss();
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [containerRef, isActive, onDismiss]);
}
