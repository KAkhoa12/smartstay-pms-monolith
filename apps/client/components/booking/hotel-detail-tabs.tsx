"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const SECTION_TABS = [
  { id: "overview", label: "Tong quan" },
  { id: "rooms", label: "Phong" },
  { id: "location", label: "Vi tri" },
  { id: "amenities", label: "Tien ich" },
  { id: "policy", label: "Chinh sach" },
  { id: "reviews", label: "Danh gia" },
];

const SCROLL_TRACKED_SECTION_IDS = ["overview", "rooms", "policy", "reviews"];

const ACTIVATION_BUFFER = 120;

const getStickyOffset = () => {
  if (typeof window === "undefined") return 160;

  const rootStyle = window.getComputedStyle(document.documentElement);
  const menuHeight = Number.parseFloat(rootStyle.getPropertyValue("--shared-top-menu-height")) || 0;
  const searchHeight = Number.parseFloat(rootStyle.getPropertyValue("--results-search-bar-height")) || 0;

  return menuHeight + searchHeight + 28;
};

export default function HotelDetailTabs() {
  const [activeSection, setActiveSection] = useState("overview");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const frameRef = useRef<number | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const tabRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const isPrimaryActiveSection = SCROLL_TRACKED_SECTION_IDS.includes(activeSection);
  const visualActiveSection = isPrimaryActiveSection ? activeSection : "overview";

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const activeTab = tabRefs.current[visualActiveSection];
      const nav = navRef.current;

      if (!activeTab || !nav) {
        setIndicatorStyle((previous) => ({ ...previous, opacity: 0 }));
        return;
      }

      setIndicatorStyle({
        left: activeTab.offsetLeft,
        width: activeTab.offsetWidth,
        opacity: 1,
      });
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);

    return () => {
      window.removeEventListener("resize", updateIndicator);
    };
  }, [visualActiveSection]);

  useEffect(() => {
    const syncActiveSection = () => {
      const stickyOffset = getStickyOffset();
      const activationLine = stickyOffset + ACTIVATION_BUFFER;
      const sections = SCROLL_TRACKED_SECTION_IDS.map((sectionId) => document.getElementById(sectionId))
        .filter((section): section is HTMLElement => section !== null)
        .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

      if (!sections.length) return;

      let nextActive = sections[0]?.id ?? "overview";

      for (const section of sections) {
        const { top } = section.getBoundingClientRect();
        if (top <= activationLine) {
          nextActive = section.id;
        }
      }

      const bottomSection = sections.at(-1);
      if (bottomSection) {
        const pageBottom = window.innerHeight + window.scrollY;
        const documentBottom = document.documentElement.scrollHeight - 12;

        if (pageBottom >= documentBottom) {
          nextActive = bottomSection.id;
        }
      }

      setActiveSection((previous) => (previous === nextActive ? previous : nextActive));
    };

    const handleScroll = () => {
      if (frameRef.current !== null) return;

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        syncActiveSection();
      });
    };

    syncActiveSection();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <nav ref={navRef} className="relative flex flex-wrap items-center gap-7 text-sm font-semibold text-slate-600">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 h-[3px] rounded-full bg-[#1791e6] transition-[left,width,opacity] duration-300 ease-out"
        style={indicatorStyle}
      />
      {SECTION_TABS.map((tab) => (
        <a
          key={tab.id}
          href={`#${tab.id}`}
          ref={(element) => {
            tabRefs.current[tab.id] = element;
          }}
          className={`py-2 transition-colors duration-300 hover:text-[#0b63c8] ${
            visualActiveSection === tab.id ? "text-[#0b63c8]" : "text-slate-600"
          }`}
        >
          {tab.label}
        </a>
      ))}
    </nav>
  );
}
