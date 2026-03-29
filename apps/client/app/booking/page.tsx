"use client";

import { type FormEvent, type PointerEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SharedTopMenu from "@/components/shared-top-menu";
import {
  DATE_PANEL_CLASS,
  GUEST_PANEL_CLASS,
  LOCATION_PANEL_CLASS,
  SEARCH_DATE_TRIGGER,
  SEARCH_GUEST_TRIGGER,
  SEARCH_LOCATION_TRIGGER_BASE,
  SEARCH_LOCATION_TRIGGER_ERROR,
  SEARCH_LOCATION_TRIGGER_NORMAL,
} from "@/components/booking/search-field-styles";
import DestinationRequiredMessage from "@/components/ui/destination-required-message";
import DropdownPanel from "@/components/ui/dropdown-panel";
import useOutsideDismiss from "@/components/ui/use-outside-dismiss";
import {
  BedDouble,
  BedSingle,
  Baby,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  DoorOpen,
  MapPin,
  Search,
  UserRound,
} from "lucide-react";

const featuredDestinations = [
  {
    city: "Phu Quoc",
    hotels: "920 khach san",
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1400&q=80",
    className: "md:col-span-8 md:row-span-1 md:h-[160px]",
  },
  {
    city: "Vung Tau",
    hotels: "597 khach san",
    image:
      "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=900&q=80",
    className: "md:col-span-4 md:row-span-2 md:h-[332px]",
  },
  {
    city: "Da Lat",
    hotels: "1178 khach san",
    image:
      "https://images.unsplash.com/photo-1541417904950-b855846fe074?auto=format&fit=crop&w=900&q=80",
    className: "md:col-span-4 md:row-span-1 md:h-[160px]",
  },
  {
    city: "Quy Nhon",
    hotels: "333 khach san",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    className: "md:col-span-4 md:row-span-1 md:h-[160px]",
  },
  {
    city: "Nha Trang",
    hotels: "1023 khach san",
    image:
      "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=900&q=80",
    className: "md:col-span-4 md:row-span-2 md:h-[264px]",
  },
  {
    city: "Da Nang",
    hotels: "1355 khach san",
    image:
      "https://images.unsplash.com/photo-1624111673546-0cfa5a81fb3f?auto=format&fit=crop&w=1200&q=80",
    className: "md:col-span-8 md:row-span-1 md:h-[128px]",
  },
  {
    city: "Phan Thiet",
    hotels: "499 khach san",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    className: "md:col-span-4 md:row-span-1 md:h-[128px]",
  },
  {
    city: "Phu Yen",
    hotels: "18 khach san",
    image:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=900&q=80",
    className: "md:col-span-4 md:row-span-1 md:h-[128px]",
  },
];

const roomDeals = [
  {
    slug: "cozi-inn-hotel",
    name: "Cozi Inn Hotel",
    location: "Pratunam",
    rating: "8.0/10",
    reviews: "1,8k danh gia",
    newPrice: "603.883 VND",
    oldPrice: "805.177 VND",
    discountPercent: 25,
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "48-ville-don-muang-airport",
    name: "48 Ville Don Muang Airport",
    location: "Don Mueang Airport",
    rating: "8.3/10",
    reviews: "4,1k danh gia",
    newPrice: "362.804 VND",
    oldPrice: "395.208 VND",
    discountPercent: 8,
    image:
      "https://images.unsplash.com/photo-1468824357306-a439d58ccb1c?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "livotel-kaset-nawamin-bangkok",
    name: "Livotel Hotel Kaset Nawamin Bangkok",
    location: "Sena Nikhom",
    rating: "8.4/10",
    reviews: "4,6k danh gia",
    newPrice: "607.335 VND",
    oldPrice: "773.286 VND",
    discountPercent: 19,
    image:
      "https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "miracle-grand-convention-hotel",
    name: "Miracle Grand Convention Hotel",
    location: "Lak Si",
    rating: "8.5/10",
    reviews: "2,8k danh gia",
    newPrice: "1.466.573 VND",
    oldPrice: "1.597.574 VND",
    discountPercent: 7,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
  },
];

const hotelPartners = [
  "Accor",
  "Asian Ruby Hotel",
  "Church Boutique Hotel",
  "Elegance Hospitality Group",
  "FLC",
  "Fusion Group",
  "Marriott",
  "Minor Hotels",
  "Muong Thanh",
  "Odyssea",
  "Rising Dragon",
  "Roseland Hotels Group",
  "Silverland",
  "TMGH",
  "TTC",
  "Vinpearl",
];

const paymentPartners = [
  "Mastercard",
  "JCB",
  "VISA",
  "AMEX",
  "VietQR",
  "MoMo",
  "Techcombank",
  "VIB",
  "Vietcombank",
  "OnePay",
  "MB",
  "HSBC",
  "Sacombank",
  "ACB",
  "TPBank",
  "VietinBank",
  "BIDV",
  "Citibank",
  "AlePay",
  "OCB",
  "SeABank",
  "ZaloPay",
  "HDBank",
  "VPBank",
  "Standard Chartered",
  "KBank",
];

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

const PROVINCES_API_BASE_URL = "https://provinces.open-api.vn/api";
const SMART_SEARCH_BG_OPACITY = 0.29;
const SMART_SEARCH_BORDER_OPACITY = 0;
const BOOKING_DESTINATION_REQUIRED_MESSAGE = "Vui long nhap diem den de bat dau tim kiem.";

export default function HomeManagementPage() {
  const router = useRouter();
  const searchFormRef = useRef<HTMLFormElement | null>(null);
  const dealMarqueeRef = useRef<HTMLDivElement | null>(null);
  const isDealDraggingRef = useRef(false);
  const dealPauseRef = useRef(false);
  const dealManualPauseRef = useRef(false);
  const dealResumeTimerRef = useRef<number | null>(null);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const [isDealHovered, setIsDealHovered] = useState(false);
  const [provinces, setProvinces] = useState<ProvinceItem[]>([]);
  const [districts, setDistricts] = useState<DistrictItem[]>([]);
  const [wards, setWards] = useState<WardItem[]>([]);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
  const [selectedDistrictCode, setSelectedDistrictCode] = useState("");
  const [selectedWardCode, setSelectedWardCode] = useState("");
  const [destinationError, setDestinationError] = useState("");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [beds, setBeds] = useState(1);
  const [petFriendly, setPetFriendly] = useState(false);
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const closeAllSearchDropdowns = () => {
    setIsLocationOpen(false);
    setIsDateOpen(false);
    setIsGuestOpen(false);
  };

  useOutsideDismiss({
    containerRef: searchFormRef,
    isActive: isLocationOpen || isDateOpen || isGuestOpen,
    onDismiss: closeAllSearchDropdowns,
  });

  const toggleSearchDropdown = (target: "location" | "date" | "guest") => {
    setIsLocationOpen((prev) => (target === "location" ? !prev : false));
    setIsDateOpen((prev) => (target === "date" ? !prev : false));
    setIsGuestOpen((prev) => (target === "guest" ? !prev : false));
  };

  useEffect(() => {
    const onScroll = () => {
      setIsHeaderCompact(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const selectedProvince = provinces.find((item) => String(item.code) === selectedProvinceCode);
  const selectedDistrict = districts.find((item) => String(item.code) === selectedDistrictCode);
  const selectedWard = wards.find((item) => String(item.code) === selectedWardCode);

  const destinationLabel = selectedWard
    ? `${selectedWard.name}, ${selectedDistrict?.name ?? ""}, ${selectedProvince?.name ?? ""}`
    : selectedDistrict
      ? `${selectedDistrict.name}, ${selectedProvince?.name ?? ""}`
      : selectedProvince?.name ?? "Ban muon den dau?";

  const dateDisplayLabel =
    checkInDate && checkOutDate
      ? `${new Date(checkInDate).toLocaleDateString("vi-VN")} - ${new Date(checkOutDate).toLocaleDateString("vi-VN")}`
      : "Nhan phong - Tra phong";
  const monthTitle = displayMonth.toLocaleDateString("vi-VN", {
    month: "long",
    year: "numeric",
  });
  const monthStartWeekday = (displayMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 0).getDate();
  const dayLabels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const sortedRoomDeals = [...roomDeals].sort((a, b) => b.discountPercent - a.discountPercent);
  const normalizeDealScroll = () => {
    const container = dealMarqueeRef.current;
    if (!container) return;

    const loopWidth = container.scrollWidth / 2;
    if (loopWidth <= 0) return;

    if (container.scrollLeft >= loopWidth) {
      container.scrollLeft -= loopWidth;
    } else if (container.scrollLeft < 0) {
      container.scrollLeft += loopWidth;
    }
  };

  useEffect(() => {
    const container = dealMarqueeRef.current;
    if (!container) return;

    let frameId = 0;

    const tick = () => {
      const loopWidth = container.scrollWidth / 2;
      if (!dealPauseRef.current && loopWidth > 0) {
        container.scrollLeft += 0.6;
        if (container.scrollLeft >= loopWidth) {
          container.scrollLeft -= loopWidth;
        }
      }

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    return () => {
      if (dealResumeTimerRef.current) {
        window.clearTimeout(dealResumeTimerRef.current);
      }
    };
  }, []);

  const clearDealResumeTimer = () => {
    if (dealResumeTimerRef.current) {
      window.clearTimeout(dealResumeTimerRef.current);
      dealResumeTimerRef.current = null;
    }
  };

  const scheduleDealResumeAfterLeave = () => {
    clearDealResumeTimer();
    dealResumeTimerRef.current = window.setTimeout(() => {
      dealManualPauseRef.current = false;
      dealPauseRef.current = false;
    }, 5000);
  };

  const handleDealPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const container = dealMarqueeRef.current;
    if (!container) return;

    isDealDraggingRef.current = true;
    dealPauseRef.current = true;
    dragStartXRef.current = event.clientX;
    dragStartScrollRef.current = container.scrollLeft;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleDealPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const container = dealMarqueeRef.current;
    if (!container || !isDealDraggingRef.current) return;

    const deltaX = event.clientX - dragStartXRef.current;
    container.scrollLeft = dragStartScrollRef.current - deltaX;
    normalizeDealScroll();
  };

  const handleDealPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDealDraggingRef.current) return;

    isDealDraggingRef.current = false;
    if (!dealManualPauseRef.current) {
      dealPauseRef.current = false;
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleDealArrowClick = (direction: "left" | "right") => {
    const container = dealMarqueeRef.current;
    if (!container) return;

    clearDealResumeTimer();
    dealManualPauseRef.current = true;
    dealPauseRef.current = true;

    const scrollAmount = Math.max(260, container.clientWidth * 0.86);
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });

    window.setTimeout(() => normalizeDealScroll(), 280);
  };

  const toIsoDate = (year: number, month: number, day: number) => {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  };

  const handlePickDate = (day: number) => {
    const picked = toIsoDate(displayMonth.getFullYear(), displayMonth.getMonth(), day);

    if (!checkInDate || (checkInDate && checkOutDate)) {
      setCheckInDate(picked);
      setCheckOutDate("");
      return;
    }

    if (picked < checkInDate) {
      setCheckInDate(picked);
      return;
    }

    setCheckOutDate(picked);
    setIsDateOpen(false);
  };

  const handleProvinceChange = async (provinceCode: string) => {
    setSelectedProvinceCode(provinceCode);
    setSelectedDistrictCode("");
    setSelectedWardCode("");
    setWards([]);
    setDestinationError("");

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

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const hasDestination = Boolean(selectedProvinceCode || selectedDistrictCode || selectedWardCode);

    if (!hasDestination) {
      setDestinationError(BOOKING_DESTINATION_REQUIRED_MESSAGE);
      setIsDateOpen(false);
      setIsGuestOpen(false);
      return;
    }

    const searchParams = new URLSearchParams({
      destination: destinationLabel,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      adults: String(adults),
      children: String(children),
      rooms: String(rooms),
      beds: String(beds),
    });

    router.push(`/booking/results?${searchParams.toString()}`);
  };

  return (
    <main className="min-h-screen bg-[#f1f4f5] text-slate-900">
      <section
        className={`relative min-h-[74vh] bg-cover bg-center transition-all duration-300 ${
          isHeaderCompact ? "pt-[150px]" : "pt-[168px]"
        }`}
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1470004914212-05527e49370b?auto=format&fit=crop&w=2200&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,62,83,0.34)_0%,rgba(31,62,83,0.12)_25%,rgba(31,62,83,0.26)_100%)]" />

        <SharedTopMenu compact={isHeaderCompact} />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl justify-center px-4 pb-24 pt-28 lg:px-8">
          <div
            className="w-full max-w-[980px] rounded-xl border-2 p-2"
            style={{
              backgroundColor: `rgba(0,0,0,${SMART_SEARCH_BG_OPACITY ?? 0.2})`,
              borderColor: `rgba(156,214,228,${SMART_SEARCH_BORDER_OPACITY ?? 0.9})`,
              boxShadow: `0 22px 48px rgba(0,0,0,${Math.min(0.75, (SMART_SEARCH_BG_OPACITY ?? 0.2) + 0.25)}), inset 0 1px 0 rgba(255,255,255,0.06)`,
            }}
          >
            <p className="mb-2 text-center text-sm font-bold tracking-[0.02em] text-[#e4f4fb] drop-shadow-[0_2px_4px_rgba(8,31,44,0.55)]">
              Tim kiem thong minh
            </p>
            <form
              ref={searchFormRef}
              className="grid gap-2 lg:grid-cols-[2.3fr_1.9fr_1.7fr_auto]"
              onSubmit={handleSearchSubmit}
            >
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setDestinationError("");
                    toggleSearchDropdown("location");
                  }}
                  className={`${SEARCH_LOCATION_TRIGGER_BASE} ${
                    destinationError ? SEARCH_LOCATION_TRIGGER_ERROR : SEARCH_LOCATION_TRIGGER_NORMAL
                  }`}
                >
                  <BedDouble className="size-4 text-slate-500" />
                  <span className="text-sm font-semibold text-slate-800">{destinationLabel}</span>
                  <ChevronDown className="ml-auto size-4 text-slate-500" />
                </button>
                <DestinationRequiredMessage message={destinationError} />
                {isLocationOpen ? (
                  <DropdownPanel className={LOCATION_PANEL_CLASS}>
                    <div className="space-y-2">
                      <select
                        value={selectedProvinceCode}
                        onChange={(event) => handleProvinceChange(event.target.value)}
                        className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-sm outline-none focus:border-[#5a9aac]"
                      >
                        <option value="">Chon Tinh/Thanh pho</option>
                        {provinces.map((province) => (
                          <option key={province.code} value={province.code}>
                            {province.name}
                          </option>
                        ))}
                      </select>

                      <select
                        value={selectedDistrictCode}
                        onChange={(event) => handleDistrictChange(event.target.value)}
                        disabled={!selectedProvinceCode}
                        className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-sm outline-none disabled:cursor-not-allowed disabled:bg-slate-100 focus:border-[#5a9aac]"
                      >
                        <option value="">Chon Quan/Huyen</option>
                        {districts.map((district) => (
                          <option key={district.code} value={district.code}>
                            {district.name}
                          </option>
                        ))}
                      </select>

                      <select
                        value={selectedWardCode}
                        onChange={(event) => {
                          setSelectedWardCode(event.target.value);
                          if (event.target.value) {
                            setDestinationError("");
                            setIsLocationOpen(false);
                          }
                        }}
                        disabled={!selectedDistrictCode}
                        className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-sm outline-none disabled:cursor-not-allowed disabled:bg-slate-100 focus:border-[#5a9aac]"
                      >
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
                <button
                  type="button"
                  onClick={() => toggleSearchDropdown("date")}
                  className={SEARCH_DATE_TRIGGER}
                >
                  <CalendarDays className="size-4 text-slate-500" />
                  <span className="text-sm font-semibold text-slate-800">{dateDisplayLabel}</span>
                  <ChevronDown className="ml-auto size-4 text-slate-500" />
                </button>
                {isDateOpen ? (
                  <DropdownPanel className={DATE_PANEL_CLASS}>
                    <p className="mb-2 text-center text-sm font-medium text-[#5a9aac]">Lich</p>
                    <div className="mb-3 flex items-center justify-between border-t border-[#8fb9c5] pt-2">
                      <button
                        type="button"
                        onClick={() =>
                          setDisplayMonth(
                            (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1),
                          )
                        }
                        className="rounded p-1 text-slate-500 hover:bg-slate-100"
                        aria-label="Thang truoc"
                      >
                        <ChevronLeft className="size-4" />
                      </button>
                      <p className="text-lg font-semibold capitalize text-slate-800">{monthTitle}</p>
                      <button
                        type="button"
                        onClick={() =>
                          setDisplayMonth(
                            (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1),
                          )
                        }
                        className="rounded p-1 text-slate-500 hover:bg-slate-100"
                        aria-label="Thang sau"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1.5 text-center text-sm text-slate-600">
                      {dayLabels.map((label) => (
                        <div key={label} className="py-1 font-medium">
                          {label}
                        </div>
                      ))}

                      {Array.from({ length: monthStartWeekday }).map((_, idx) => (
                        <div key={`empty-${idx}`} />
                      ))}

                      {Array.from({ length: daysInMonth }).map((_, idx) => {
                        const day = idx + 1;
                        const iso = toIsoDate(displayMonth.getFullYear(), displayMonth.getMonth(), day);
                        const isStart = iso === checkInDate;
                        const isEnd = iso === checkOutDate;
                        const isInRange =
                          Boolean(checkInDate) &&
                          Boolean(checkOutDate) &&
                          iso > checkInDate &&
                          iso < checkOutDate;

                        return (
                          <button
                            key={iso}
                            type="button"
                            onClick={() => handlePickDate(day)}
                            className={`h-10 rounded text-sm ${
                              isStart || isEnd
                                ? "bg-[#5a9aac] font-semibold text-white"
                                : isInRange
                                  ? "bg-[#e8f1f5] text-[#4f7385]"
                                  : "text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </DropdownPanel>
                ) : null}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleSearchDropdown("guest")}
                  className={SEARCH_GUEST_TRIGGER}
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
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
                      {[
                        { label: "Nguoi lon", value: adults, min: 1, max: 20, set: setAdults },
                        { label: "Tre em", value: children, min: 0, max: 10, set: setChildren },
                        { label: "Phong", value: rooms, min: 1, max: 10, set: setRooms },
                        { label: "Giuong", value: beds, min: 1, max: 4, set: setBeds },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between">
                          <p className="text-sm font-medium text-slate-800">{item.label}</p>
                          <div className="flex h-9 items-center rounded-md border border-slate-300">
                            <button
                              type="button"
                              onClick={() => item.set((prev) => Math.max(item.min, prev - 1))}
                              className="h-full w-8 text-lg text-[#5a9aac] hover:bg-slate-100 disabled:text-slate-300"
                              disabled={item.value <= item.min}
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-base font-semibold text-slate-900">{item.value}</span>
                            <button
                              type="button"
                              onClick={() => item.set((prev) => Math.min(item.max, prev + 1))}
                              className="h-full w-8 text-lg text-[#5a9aac] hover:bg-slate-100 disabled:text-slate-300"
                              disabled={item.value >= item.max}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="my-4 border-t border-slate-200 pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-800">Mang thu cung di cung</p>
                          <p className="mt-1 text-xs text-slate-600">
                            Dong vat tro giup khong duoc xem la vat nuoi.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPetFriendly((prev) => !prev)}
                          className={`flex size-6 items-center justify-center rounded border transition ${
                            petFriendly
                              ? "border-[#5a9aac] bg-[#5a9aac] text-white"
                              : "border-slate-300 bg-white text-transparent"
                          }`}
                          aria-label="Bat tat thu cung"
                        >
                          <Check className="size-4" />
                        </button>
                      </div>
                      <a href="#" className="mt-2 inline-block text-xs text-[#5a9aac] hover:underline">
                        Doc them ve chu de di du lich cung dong vat tro giup
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsGuestOpen(false)}
                      className="h-9 w-full rounded-md border border-[#5a9aac] bg-white text-sm font-semibold text-[#5a9aac] hover:bg-[#e8f1f5]"
                    >
                      Xong
                    </button>
                  </DropdownPanel>
                ) : null}
              </div>

              <button
                type="submit"
                aria-label="Tim kiem"
                className="glossy-button flex h-11 items-center justify-center rounded-md px-5 text-white"
              >
                <Search className="size-5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-[#f7fafb] py-8">
        <div className="mx-auto w-full max-w-6xl px-4 lg:px-8">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-[30px] font-bold leading-tight text-slate-800">Uu dai</h2>
          </div>

          <div
            className="relative"
            onMouseEnter={() => {
              clearDealResumeTimer();
              setIsDealHovered(true);
            }}
            onMouseLeave={() => {
              setIsDealHovered(false);
              if (dealManualPauseRef.current) {
                scheduleDealResumeAfterLeave();
              }
            }}
          >
            {isDealHovered ? (
              <button
                type="button"
                aria-label="Uu dai truoc"
                onClick={() => handleDealArrowClick("left")}
                className="absolute left-[-22px] top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#c8dbe3] bg-white text-[#3b7588] shadow-[0_8px_16px_rgba(35,82,101,0.22)] transition hover:bg-[#edf6fa]"
              >
                <ChevronLeft className="size-5" />
              </button>
            ) : null}

            {isDealHovered ? (
              <button
                type="button"
                aria-label="Uu dai tiep theo"
                onClick={() => handleDealArrowClick("right")}
                className="absolute right-[-22px] top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#c8dbe3] bg-white text-[#3b7588] shadow-[0_8px_16px_rgba(35,82,101,0.22)] transition hover:bg-[#edf6fa]"
              >
                <ChevronRight className="size-5" />
              </button>
            ) : null}

            <div
              ref={dealMarqueeRef}
              className="deal-marquee overflow-hidden select-none cursor-grab active:cursor-grabbing"
              onPointerDown={handleDealPointerDown}
              onPointerMove={handleDealPointerMove}
              onPointerUp={handleDealPointerUp}
              onPointerCancel={handleDealPointerUp}
            >
              <div className="flex w-max gap-3 pb-1">
                {[...sortedRoomDeals, ...sortedRoomDeals].map((deal, index) => (
                <Link
                  key={`${deal.name}-${index}`}
                  href={`/deals/${deal.slug}`}
                  className="min-w-[270px] overflow-hidden rounded-xl border border-[#d5e6eb] bg-white shadow-[0_8px_16px_rgba(35,82,101,0.08)] transition hover:-translate-y-[2px] hover:shadow-[0_12px_22px_rgba(35,82,101,0.14)] md:min-w-[285px]"
                >
                  <article>
                    <div
                      className="relative h-36 bg-cover bg-center"
                      style={{ backgroundImage: `url('${deal.image}')` }}
                    >
                      <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded bg-[#2f6fb1] px-2 py-1 text-[11px] font-semibold text-white">
                        <MapPin className="size-3" />
                        {deal.location}
                      </span>
                      <span className="absolute bottom-2 right-2 rounded bg-[#ff7a00] px-2 py-1 text-xs font-bold text-white">
                        Tiet kiem {deal.discountPercent}%
                      </span>
                    </div>

                    <div className="p-3">
                      <h3 className="min-h-10 text-[15px] font-semibold leading-5 text-slate-800">{deal.name}</h3>
                      <p className="mt-1 text-xs text-slate-600">
                        <span className="font-semibold text-[#2f6fb1]">{deal.rating}</span> • {deal.reviews}
                      </p>
                      <p className="mt-2 text-xs text-slate-400 line-through">{deal.oldPrice}</p>
                      <p className="text-xl font-bold text-[#f57f18]">{deal.newPrice}</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-300 bg-[#f3f5f7] py-8">
        <div className="mx-auto w-full max-w-6xl px-4 lg:px-8">
          <h2 className="text-[40px] font-bold leading-tight text-slate-800">Diem den yeu thich trong nuoc</h2>

          <div className="mt-6 grid gap-3 md:grid-cols-12 md:grid-rows-4">
            {featuredDestinations.map((item) => (
              <article
                key={item.city}
                className={`group relative h-[170px] overflow-hidden rounded-[10px] shadow-[0_8px_18px_rgba(30,57,79,0.18)] ${item.className}`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${item.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="text-[34px] font-bold leading-none tracking-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
                    {item.city}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white/95">{item.hotels}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-300 bg-[#f7f8fa] py-10">
        <div className="mx-auto w-full max-w-6xl px-4 lg:px-8">
          <h2 className="text-[44px] font-bold leading-tight text-slate-900">Doi tac khach san</h2>
          <p className="mt-2 text-[28px] text-slate-600">Doi tac khach san trong nuoc & quoc te</p>
          <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-700">
            Chung toi hop tac voi cac chuoi khach san uy tin toan cau de mang den cho ban cho o thoai mai va dang
            tin cay, du ban di bat cu dau.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">
            {hotelPartners.map((partner) => (
              <article
                key={partner}
                className="rounded-lg border border-[#dde9ef] bg-white/85 px-3 py-3 text-center shadow-[0_6px_14px_rgba(24,63,86,0.08)]"
              >
                <p className="text-xs font-semibold tracking-wide text-slate-700">{partner}</p>
              </article>
            ))}
          </div>

          <h3 className="mt-12 text-[44px] font-bold leading-tight text-slate-900">Doi tac thanh toan</h3>
          <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-700">
            Chung toi hop tac voi cac nha cung cap dich vu thanh toan hang dau de dam bao moi giao dich deu suon se,
            an toan va de dang.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">
            {paymentPartners.map((partner) => (
              <article
                key={partner}
                className="rounded-lg border border-[#dde9ef] bg-white/85 px-3 py-3 text-center shadow-[0_6px_14px_rgba(24,63,86,0.08)]"
              >
                <p className="text-xs font-semibold tracking-wide text-slate-700">{partner}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
