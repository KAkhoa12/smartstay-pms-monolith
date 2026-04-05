"use client";

import { type FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Baby,
  BedSingle,
  ChevronDown,
  DoorOpen,
  Funnel,
  MapPin,
  Minus,
  Plus,
  UserRound,
} from "lucide-react";
import DestinationRequiredMessage from "@/components/ui/destination-required-message";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import DropdownPanel from "@/components/ui/dropdown-panel";
import useOutsideDismiss from "@/components/ui/use-outside-dismiss";
import {
  DATE_PANEL_CLASS,
  GUEST_PANEL_CLASS,
  LOCATION_PANEL_CLASS,
  SEARCH_DATE_TRIGGER,
  SEARCH_GUEST_TRIGGER,
  SEARCH_LOCATION_TRIGGER_BASE,
  SEARCH_LOCATION_TRIGGER_ERROR,
  SEARCH_LOCATION_TRIGGER_NORMAL,
  SEARCH_SUBMIT_BUTTON,
} from "@/components/booking/search-field-styles";

type WardItem = {
  code: number;
  name: string;
};

type DistrictItem = {
  code: number;
  name: string;
  wards?: WardItem[];
};

type ProvinceItem = {
  code: number;
  name: string;
  districts?: DistrictItem[];
};

type DistrictDetailResponse = {
  code: number;
  name: string;
  wards?: WardItem[];
};

type SharedSearchShellProps = {
  submitPath: string;
  initialDestination?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialAdults?: number;
  initialChildren?: number;
  initialRooms?: number;
  initialBeds?: number;
  showFilterButton?: boolean;
  onFilterClick?: () => void;
  submitLabel?: string;
  bottomContent?: ReactNode;
};

const PROVINCES_API_BASE_URL = "https://provinces.open-api.vn/api";
const COMPACT_THRESHOLD = 96;
const COMPACT_HYSTERESIS = 24;
const EXPANDED_HEIGHT = 82;
const COMPACT_HEIGHT = 68;
const DESTINATION_REQUIRED_MESSAGE = "Vui long nhap diem den de bat dau tim kiem.";

export default function SharedSearchShell({
  submitPath,
  initialDestination = "",
  initialCheckIn = "",
  initialCheckOut = "",
  initialAdults = 2,
  initialChildren = 0,
  initialRooms = 1,
  initialBeds = 1,
  showFilterButton = true,
  onFilterClick,
  submitLabel = "Tim khach san",
  bottomContent,
}: SharedSearchShellProps) {
  const router = useRouter();
  const searchRef = useRef<HTMLFormElement | null>(null);
  const frameRef = useRef<number | null>(null);

  const [provinces, setProvinces] = useState<ProvinceItem[]>([]);
  const [districts, setDistricts] = useState<DistrictItem[]>([]);
  const [wards, setWards] = useState<WardItem[]>([]);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
  const [selectedDistrictCode, setSelectedDistrictCode] = useState("");
  const [selectedWardCode, setSelectedWardCode] = useState("");
  const [destinationFromQuery, setDestinationFromQuery] = useState(initialDestination);
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [adults, setAdults] = useState(initialAdults);
  const [children, setChildren] = useState(initialChildren);
  const [rooms, setRooms] = useState(initialRooms);
  const [beds, setBeds] = useState(initialBeds);
  const [destinationError, setDestinationError] = useState("");
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const syncCompactState = () => {
      setIsCompact((previous) => {
        const nextCompact = previous
          ? window.scrollY > COMPACT_THRESHOLD - COMPACT_HYSTERESIS
          : window.scrollY > COMPACT_THRESHOLD + COMPACT_HYSTERESIS;

        return nextCompact;
      });
    };

    const handleScroll = () => {
      if (frameRef.current !== null) return;

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        syncCompactState();
      });
    };

    syncCompactState();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--results-search-bar-height",
      `${isCompact ? COMPACT_HEIGHT : EXPANDED_HEIGHT}px`,
    );
  }, [isCompact]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch(`${PROVINCES_API_BASE_URL}/p/`, {
          headers: { Accept: "application/json" },
        });
        if (!response.ok) return;
        const data = (await response.json()) as ProvinceItem[];
        setProvinces(data);
      } catch {
        setProvinces([]);
      }
    };

    fetchProvinces();
  }, []);

  useOutsideDismiss({
    containerRef: searchRef,
    isActive: isDestinationOpen || isDateOpen || isGuestOpen,
    onDismiss: () => {
      setIsDestinationOpen(false);
      setIsDateOpen(false);
      setIsGuestOpen(false);
    },
  });

  const selectedProvince = provinces.find((item) => String(item.code) === selectedProvinceCode);
  const selectedDistrict = districts.find((item) => String(item.code) === selectedDistrictCode);
  const selectedWard = wards.find((item) => String(item.code) === selectedWardCode);

  const destinationLabel = selectedWard
    ? `${selectedWard.name}, ${selectedDistrict?.name ?? ""}, ${selectedProvince?.name ?? ""}`
    : selectedDistrict
      ? `${selectedDistrict.name}, ${selectedProvince?.name ?? ""}`
      : selectedProvince?.name ?? (destinationFromQuery || "Ban muon den dau?");

  const stayDurationLabel = useMemo(() => {
    if (!checkIn || !checkOut) return "Thoi gian: Chua chon";
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const nights = Math.max(1, Math.round((outDate.getTime() - inDate.getTime()) / 86400000));
    return `Thoi gian: ${nights} dem`;
  }, [checkIn, checkOut]);

  const toggleSearchDropdown = (target: "destination" | "date" | "guest") => {
    setIsDestinationOpen((prev) => (target === "destination" ? !prev : false));
    setIsDateOpen((prev) => (target === "date" ? !prev : false));
    setIsGuestOpen((prev) => (target === "guest" ? !prev : false));
  };

  const handleProvinceChange = async (provinceCode: string) => {
    setSelectedProvinceCode(provinceCode);
    setSelectedDistrictCode("");
    setSelectedWardCode("");
    setWards([]);
    setDestinationError("");
    setDestinationFromQuery("");

    if (!provinceCode) {
      setDistricts([]);
      return;
    }

    try {
      const response = await fetch(`${PROVINCES_API_BASE_URL}/p/${provinceCode}?depth=2`, {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        setDistricts([]);
        return;
      }
      const data = (await response.json()) as ProvinceItem;
      setDistricts(data.districts ?? []);
    } catch {
      setDistricts([]);
    }
  };

  const handleDistrictChange = async (districtCode: string) => {
    setSelectedDistrictCode(districtCode);
    setSelectedWardCode("");
    if (districtCode) {
      setDestinationError("");
      setDestinationFromQuery("");
    }

    if (!districtCode) {
      setWards([]);
      return;
    }

    try {
      const response = await fetch(`${PROVINCES_API_BASE_URL}/d/${districtCode}?depth=2`, {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        setWards([]);
        return;
      }
      const data = (await response.json()) as DistrictDetailResponse;
      setWards(data.wards ?? []);
    } catch {
      setWards([]);
    }
  };

  const stepper = (value: number, min: number, max: number, setValue: (value: number) => void) => (
    <div className="inline-flex items-center rounded-md border border-slate-300 bg-white">
      <button type="button" className="px-3 py-1 text-slate-500 disabled:opacity-40" disabled={value <= min} onClick={() => setValue(Math.max(min, value - 1))}>
        <Minus className="size-4" />
      </button>
      <span className="w-8 text-center text-sm font-semibold text-slate-700">{value}</span>
      <button type="button" className="px-3 py-1 text-[#148dd4] disabled:opacity-40" disabled={value >= max} onClick={() => setValue(Math.min(max, value + 1))}>
        <Plus className="size-4" />
      </button>
    </div>
  );

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const hasDestination = Boolean(
      selectedProvinceCode || selectedDistrictCode || selectedWardCode || destinationFromQuery.trim(),
    );

    if (!hasDestination) {
      setDestinationError(DESTINATION_REQUIRED_MESSAGE);
      setIsDateOpen(false);
      setIsGuestOpen(false);
      return;
    }

    const nextParams = new URLSearchParams({
      destination: destinationLabel,
      checkIn,
      checkOut,
      adults: String(adults),
      children: String(children),
      rooms: String(rooms),
      beds: String(beds),
    });

    router.push(`${submitPath}?${nextParams.toString()}`);
  };

  return (
    <>
      <section
        className={`sticky z-[120] w-full border-y border-slate-200 bg-white/95 shadow-[0_8px_20px_rgba(15,45,70,0.08)] transition-all duration-300 ${
          isCompact ? "backdrop-blur-md" : ""
        }`}
        style={{ top: "var(--shared-top-menu-height)" }}
      >
        <div
          className={`mx-auto w-full max-w-6xl px-4 transition-all duration-300 ${
            isCompact ? "py-2" : "py-3"
          }`}
        >
          <form
            ref={searchRef}
            onSubmit={submitSearch}
            className={`grid items-start gap-2 ${
              showFilterButton
                ? "lg:grid-cols-[auto_2.3fr_1.9fr_1.7fr_auto]"
                : "lg:grid-cols-[2.3fr_1.9fr_1.7fr_auto]"
            }`}
          >
            {showFilterButton ? (
              <button
                type="button"
                onClick={onFilterClick}
                className={`inline-flex items-center justify-center rounded-md border border-[#8fc8db] bg-gradient-to-b from-[#dff2f8] to-[#b8dfec] text-[#2f748b] shadow-[0_8px_18px_rgba(64,123,145,0.26)] transition-all duration-300 hover:-translate-y-[1px] hover:from-[#e8f7fc] hover:to-[#c8e8f2] ${
                  isCompact ? "h-9 w-9" : "h-10 w-10"
                }`}
              >
                <Funnel className={`transition-all duration-300 ${isCompact ? "size-4" : "size-[18px]"}`} />
              </button>
            ) : null}

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setDestinationError("");
                  toggleSearchDropdown("destination");
                }}
                className={`${SEARCH_LOCATION_TRIGGER_BASE} ${
                  destinationError ? SEARCH_LOCATION_TRIGGER_ERROR : SEARCH_LOCATION_TRIGGER_NORMAL
                }`}
              >
                <MapPin className="size-4 text-slate-500" />
                <span className="truncate text-sm font-semibold">{destinationLabel}</span>
                <ChevronDown className="ml-auto size-4 text-slate-500" />
              </button>
              <DestinationRequiredMessage message={destinationError} />
              {isDestinationOpen ? (
                <DropdownPanel className={LOCATION_PANEL_CLASS}>
                  <div className="space-y-2">
                    <select value={selectedProvinceCode} onChange={(event) => handleProvinceChange(event.target.value)} className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-sm outline-none focus:border-[#5a9aac]">
                      <option value="">Chon Tinh/Thanh pho</option>
                      {provinces.map((province) => (
                        <option key={province.code} value={province.code}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                    <select value={selectedDistrictCode} onChange={(event) => handleDistrictChange(event.target.value)} disabled={!selectedProvinceCode} className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-sm outline-none disabled:cursor-not-allowed disabled:bg-slate-100 focus:border-[#5a9aac]">
                      <option value="">Chon Quan/Huyen</option>
                      {districts.map((district) => (
                        <option key={district.code} value={district.code}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                    <select value={selectedWardCode} onChange={(event) => { setSelectedWardCode(event.target.value); if (event.target.value) { setDestinationError(""); setDestinationFromQuery(""); setIsDestinationOpen(false); } }} disabled={!selectedDistrictCode} className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-sm outline-none disabled:cursor-not-allowed disabled:bg-slate-100 focus:border-[#5a9aac]">
                      <option value="">Chon Phuong/Xa</option>
                      {wards.map((ward) => (
                        <option key={ward.code} value={ward.code}>
                          {ward.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </DropdownPanel>
              ) : null}
            </div>

            <div className="relative">
              <DateRangePicker
                checkIn={checkIn}
                checkOut={checkOut}
                onChange={({ checkIn: nextCheckIn, checkOut: nextCheckOut }) => {
                  setCheckIn(nextCheckIn);
                  setCheckOut(nextCheckOut);
                }}
                open={isDateOpen}
                onOpenChange={(open) => {
                  setIsDateOpen(open);
                  if (open) {
                    setIsDestinationOpen(false);
                    setIsGuestOpen(false);
                  }
                }}
                triggerClassName={SEARCH_DATE_TRIGGER}
                dropdownClassName={DATE_PANEL_CLASS}
                placeholder="Nhan phong - Tra phong"
              />
              <p className={`px-1 text-slate-500 transition-all duration-300 ${isCompact ? "pt-0 text-[11px]" : "pt-0.5 text-xs"}`}>
                {stayDurationLabel}
              </p>
            </div>

            <div className="relative">
              <button type="button" onClick={() => toggleSearchDropdown("guest")} className={SEARCH_GUEST_TRIGGER}>
                <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-800">
                  <span className="inline-flex items-center gap-1">
                    <UserRound className="size-3.5 text-slate-500" />
                    <span>{adults}</span>
                  </span>
                  <span className="text-slate-400">-</span>
                  <span className="inline-flex items-center gap-1">
                    <Baby className="size-3.5 text-slate-500" />
                    <span>{children}</span>
                  </span>
                  <span className="text-slate-400">-</span>
                  <span className="inline-flex items-center gap-1">
                    <DoorOpen className="size-3.5 text-slate-500" />
                    <span>{rooms}</span>
                  </span>
                  <span className="text-slate-400">-</span>
                  <span className="inline-flex items-center gap-1">
                    <BedSingle className="size-3.5 text-slate-500" />
                    <span>{beds}</span>
                  </span>
                </span>
                <ChevronDown className="ml-auto size-4 text-slate-500" />
              </button>
              {isGuestOpen ? (
                <DropdownPanel className={GUEST_PANEL_CLASS}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm"><span>Nguoi lon</span>{stepper(adults, 1, 20, setAdults)}</div>
                    <div className="flex items-center justify-between text-sm"><span>Tre em</span>{stepper(children, 0, 10, setChildren)}</div>
                    <div className="flex items-center justify-between text-sm"><span>Phong</span>{stepper(rooms, 1, 10, setRooms)}</div>
                    <div className="flex items-center justify-between text-sm"><span>Giuong</span>{stepper(beds, 1, 8, setBeds)}</div>
                  </div>
                </DropdownPanel>
              ) : null}
            </div>

            <button type="submit" className={SEARCH_SUBMIT_BUTTON}>
              {submitLabel}
            </button>
          </form>

          {bottomContent ? <div className="pt-2">{bottomContent}</div> : null}
        </div>
      </section>
    </>
  );
}
