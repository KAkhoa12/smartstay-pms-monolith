"use client";

import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import SharedTopMenu from "@/components/shared-top-menu";
import DestinationRequiredMessage from "@/components/ui/destination-required-message";
import DropdownPanel from "@/components/ui/dropdown-panel";
import useOutsideDismiss from "@/components/ui/use-outside-dismiss";
import {
  AlignJustify,
  Baby,
  BedDouble,
  BedSingle,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  DoorOpen,
  Heart,
  MapPin,
  Minus,
  Plus,
  SlidersHorizontal,
  Star,
  UserRound,
  X,
} from "lucide-react";

type HotelItem = {
  id: string;
  name: string;
  area: string;
  distance: string;
  rating: string;
  reviews: string;
  price: string;
  oldPrice: string;
  image: string;
  perks: string[];
};

const RESULTS_DESTINATION_REQUIRED_MESSAGE = "Vui long nhap diem den de bat dau tim kiem.";

const hotels: HotelItem[] = [
  {
    id: "ecotime-villa-da-lat",
    name: "ECOTIME Villa Da Lat",
    area: "Da Lat",
    distance: "Cach trung tam 2,8km",
    rating: "7,8",
    reviews: "65 danh gia",
    price: "252.720 VND",
    oldPrice: "520.000 VND",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
    perks: ["Mien phi huy", "Khong can thanh toan truoc"],
  },
  {
    id: "elc-luxury-da-lat",
    name: "ELC Luxury Da Lat Hotel & Apartment",
    area: "Da Lat",
    distance: "Cach trung tam 0,7km",
    rating: "8,2",
    reviews: "42 danh gia",
    price: "1.445.850 VND",
    oldPrice: "1.912.500 VND",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
    perks: ["Bao bua sang", "Khong can thanh toan truoc"],
  },
  {
    id: "an-phu-home",
    name: "AN PHU Home",
    area: "Da Lat",
    distance: "Cach trung tam 2,9km",
    rating: "9,4",
    reviews: "284 danh gia",
    price: "792.000 VND",
    oldPrice: "900.000 VND",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    perks: ["Phong co giuong King", "Canh nui dep"],
  },
];

type FilterOption = { key: string; label: string; count?: number };
type FilterGroup = { id: string; title: string; options?: FilterOption[]; custom?: "location" | "roomBed" };

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

const filterGroups: FilterGroup[] = [
  { id: "popular", title: "Loc pho bien", options: [{ key: "free-cancel", label: "Mien phi huy", count: 540 }, { key: "pay-later", label: "Khong can thanh toan truoc", count: 330 }, { key: "breakfast", label: "Bao gom bua sang", count: 155 }] },
  { id: "location", title: "Dia diem", custom: "location" },
  { id: "meal", title: "Bua an", options: [{ key: "meal-breakfast", label: "Bao gom bua sang", count: 65 }, { key: "meal-all", label: "Tat ca cac bua", count: 1 }, { key: "meal-self", label: "Tu nau", count: 83 }] },
  { id: "property", title: "Loai cho o", options: [{ key: "hotel", label: "Khach san", count: 100 }, { key: "apartment", label: "Can ho", count: 61 }, { key: "resort", label: "Resort", count: 10 }, { key: "villa", label: "Biet thu", count: 7 }, { key: "homestay", label: "Cho nghi nha dan", count: 4 }] },
  { id: "room-bed", title: "Phong va giuong", custom: "roomBed" },
  { id: "amenities", title: "Tien nghi", options: [{ key: "parking", label: "Cho do xe", count: 149 }, { key: "pool", label: "Ho boi", count: 123 }, { key: "spa", label: "Trung tam Spa", count: 55 }, { key: "wifi", label: "WiFi mien phi", count: 157 }] },
  { id: "room-amenities", title: "Tien nghi phong", options: [{ key: "sea-view", label: "Nhin ra bien", count: 105 }, { key: "balcony", label: "Ban cong", count: 138 }, { key: "private-bath", label: "Phong tam rieng", count: 162 }, { key: "aircon", label: "Dieu hoa khong khi", count: 168 }] },
  { id: "star", title: "Xep hang cho nghi", options: [{ key: "2-star", label: "2 sao", count: 5 }, { key: "3-star", label: "3 sao", count: 36 }, { key: "4-star", label: "4 sao", count: 38 }, { key: "5-star", label: "5 sao", count: 47 }] },
  { id: "bed-option", title: "Tuy chon giuong", options: [{ key: "double-bed", label: "Giuong doi", count: 165 }, { key: "twin-bed", label: "Hai giuong don", count: 54 }] },
  { id: "zone", title: "Khu vuc", options: [{ key: "fav-zone", label: "Khu vuc khach thich", count: 90 }, { key: "ward-3", label: "Phuong 3", count: 291 }] },
  { id: "policy", title: "Chinh sach dat phong", options: [{ key: "policy-no-prepay", label: "Khong can thanh toan truoc", count: 129 }, { key: "policy-no-cc", label: "Dat phong khong can the tin dung", count: 99 }, { key: "policy-free-cancel", label: "Mien phi huy", count: 27 }] },
  { id: "distance", title: "Khoang cach trung tam", options: [{ key: "distance-1", label: "Duoi 1 km", count: 72 }, { key: "distance-3", label: "Duoi 3 km", count: 113 }, { key: "distance-5", label: "Duoi 5 km", count: 146 }] },
  { id: "brand", title: "Thuong hieu", options: [{ key: "brand-muong-thanh", label: "Muong Thanh Hospitality", count: 4 }, { key: "brand-intercontinental", label: "InterContinental Hotels & Resorts", count: 2 }, { key: "brand-marriott", label: "Marriott Hotels & Resorts", count: 1 }, { key: "brand-sheraton", label: "Sheraton", count: 1 }] },
  { id: "accessible-room", title: "Tien nghi cho nguoi khuyet tat (phong)", options: [{ key: "acc-rollin", label: "Phong tam tiep can nguoi khuyet tat", count: 19 }, { key: "acc-elevator", label: "Cac tang tren di len bang thang may", count: 78 }, { key: "acc-ground", label: "Hoan toan nam o tang tret", count: 16 }, { key: "acc-wheelchair", label: "Xe lan co the di den moi noi trong toan bo khach san", count: 62 }] },
];

const PROVINCES_API_BASE_URL = "https://provinces.open-api.vn/api";

const parseNumber = (value: string | null, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export default function BookingResultsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  const searchRef = useRef<HTMLFormElement | null>(null);

  const [provinces, setProvinces] = useState<ProvinceItem[]>([]);
  const [districts, setDistricts] = useState<DistrictItem[]>([]);
  const [wards, setWards] = useState<WardItem[]>([]);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
  const [selectedDistrictCode, setSelectedDistrictCode] = useState("");
  const [selectedWardCode, setSelectedWardCode] = useState("");
  const [destinationFromQuery, setDestinationFromQuery] = useState(() => searchParams.get("destination") ?? "");
  const [checkIn, setCheckIn] = useState(() => searchParams.get("checkIn") ?? "");
  const [checkOut, setCheckOut] = useState(() => searchParams.get("checkOut") ?? "");
  const [adults, setAdults] = useState(() => parseNumber(searchParams.get("adults"), 2));
  const [children, setChildren] = useState(() => parseNumber(searchParams.get("children"), 0));
  const [rooms, setRooms] = useState(() => parseNumber(searchParams.get("rooms"), 1));
  const [beds, setBeds] = useState(() => parseNumber(searchParams.get("beds"), 1));
  const [bathrooms, setBathrooms] = useState(0);
  const [destinationError, setDestinationError] = useState("");

  const [isDestinationOpen, setIsDestinationOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  const [filterKeyword, setFilterKeyword] = useState("");
  const [distanceRadius, setDistanceRadius] = useState("1 km");
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(() => {
    const checkInParam = searchParams.get("checkIn");
    if (checkInParam) {
      const parsed = new Date(checkInParam);
      if (!Number.isNaN(parsed.getTime())) {
        return new Date(parsed.getFullYear(), parsed.getMonth(), 1);
      }
    }
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(filterGroups.map((group, index) => [group.id, index < 3])),
  );

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

  useEffect(() => {
    const current = new URLSearchParams(searchKey);
    setDestinationFromQuery(current.get("destination") ?? "");
    setSelectedProvinceCode("");
    setSelectedDistrictCode("");
    setSelectedWardCode("");
    setDistricts([]);
    setWards([]);
    setCheckIn(current.get("checkIn") ?? "");
    setCheckOut(current.get("checkOut") ?? "");
    setAdults(parseNumber(current.get("adults"), 2));
    setChildren(parseNumber(current.get("children"), 0));
    setRooms(parseNumber(current.get("rooms"), 1));
    setBeds(parseNumber(current.get("beds"), 1));
    const nextCheckIn = current.get("checkIn");
    if (nextCheckIn) {
      const parsed = new Date(nextCheckIn);
      if (!Number.isNaN(parsed.getTime())) {
        setDisplayMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
      }
    }
  }, [searchKey]);

  const closeSearchDropdowns = () => {
    setIsDestinationOpen(false);
    setIsDateOpen(false);
    setIsGuestOpen(false);
  };

  useOutsideDismiss({
    containerRef: searchRef,
    isActive: isDestinationOpen || isDateOpen || isGuestOpen,
    onDismiss: closeSearchDropdowns,
  });

  const toggleSearchDropdown = (target: "destination" | "date" | "guest") => {
    setIsDestinationOpen((prev) => (target === "destination" ? !prev : false));
    setIsDateOpen((prev) => (target === "date" ? !prev : false));
    setIsGuestOpen((prev) => (target === "guest" ? !prev : false));
  };

  const selectedProvince = provinces.find((item) => String(item.code) === selectedProvinceCode);
  const selectedDistrict = districts.find((item) => String(item.code) === selectedDistrictCode);
  const selectedWard = wards.find((item) => String(item.code) === selectedWardCode);

  const destinationLabel = selectedWard
    ? `${selectedWard.name}, ${selectedDistrict?.name ?? ""}, ${selectedProvince?.name ?? ""}`
    : selectedDistrict
      ? `${selectedDistrict.name}, ${selectedProvince?.name ?? ""}`
      : selectedProvince?.name ?? (destinationFromQuery || "Ban muon den dau?");

  const monthTitle = displayMonth.toLocaleDateString("vi-VN", {
    month: "long",
    year: "numeric",
  });
  const monthStartWeekday = (displayMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 0).getDate();
  const dayLabels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  const stayDurationLabel = useMemo(() => {
    if (!checkIn || !checkOut) return "Thoi gian: Chua chon";
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const nights = Math.max(1, Math.round((outDate.getTime() - inDate.getTime()) / 86400000));
    return `Thoi gian: ${nights} dem`;
  }, [checkIn, checkOut]);

  const dateLabel =
    checkIn && checkOut
      ? `${new Date(checkIn).toLocaleDateString("vi-VN")} - ${new Date(checkOut).toLocaleDateString("vi-VN")}`
      : "Nhan phong - Tra phong";
  const guestLabel = `${adults} nguoi lon, ${children} tre em, ${rooms} phong`;
  const hotelGridItems = [...hotels, ...hotels];

  const toIsoDate = (year: number, month: number, day: number) => {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  };

  const handlePickDate = (day: number) => {
    const picked = toIsoDate(displayMonth.getFullYear(), displayMonth.getMonth(), day);

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(picked);
      setCheckOut("");
      return;
    }

    if (picked < checkIn) {
      setCheckIn(picked);
      return;
    }

    setCheckOut(picked);
    setIsDateOpen(false);
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

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const hasDestination = Boolean(
      selectedProvinceCode || selectedDistrictCode || selectedWardCode || destinationFromQuery.trim(),
    );
    if (!hasDestination) {
      setDestinationError(RESULTS_DESTINATION_REQUIRED_MESSAGE);
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

    router.push(`${pathname}?${nextParams.toString()}`);
  };

  const toggleFilter = (id: string) => {
    setOpenFilters((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCheckbox = (key: string) => {
    setCheckedMap((prev) => ({ ...prev, [key]: !prev[key] }));
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

  const filterSidebarContent = (
    <div className="space-y-3 p-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-1 flex items-center justify-between"><h3 className="text-xl font-bold text-slate-900">Khoang gia</h3><button type="button" className="text-sm font-semibold text-[#1e89cc]">Dat lai</button></div>
        <p className="text-sm text-slate-600">1 phong, 1 dem</p>
        <div className="mt-4 h-2 rounded-full bg-slate-200"><div className="h-2 w-2/3 rounded-full bg-[#1e89cc]" /></div>
        <div className="mt-3 flex items-center justify-between text-sm"><span>0 VND</span><span>24.000.000 VND</span></div>
      </div>

      {filterGroups.map((group) => (
        <div key={group.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <button type="button" onClick={() => toggleFilter(group.id)} className="flex w-full items-center justify-between bg-[#f8fbfe] px-4 py-3 text-left">
            <span className="font-bold text-slate-900">{group.title}</span>
            <ChevronDown className={`size-4 text-slate-500 transition ${openFilters[group.id] ? "rotate-180" : ""}`} />
          </button>
          {openFilters[group.id] ? (
            <div className="space-y-3 px-4 py-3">
              {group.custom === "location" ? (
                <>
                  <p className="text-sm text-slate-600">Dia danh hoac san bay</p>
                  <input value={filterKeyword} onChange={(event) => setFilterKeyword(event.target.value)} placeholder="Vi du: Bao tang, nha ga" className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#53a8cb]" />
                  <select value={distanceRadius} onChange={(event) => setDistanceRadius(event.target.value)} className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#53a8cb]">
                    <option>1 km</option>
                    <option>3 km</option>
                    <option>5 km</option>
                  </select>
                </>
              ) : null}

              {group.custom === "roomBed" ? (
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between"><span className="inline-flex items-center gap-2"><BedDouble className="size-4 text-slate-500" />Phong ngu</span>{stepper(rooms, 0, 10, setRooms)}</div>
                  <div className="flex items-center justify-between"><span className="inline-flex items-center gap-2"><BedSingle className="size-4 text-slate-500" />Giuong</span>{stepper(beds, 0, 20, setBeds)}</div>
                  <div className="flex items-center justify-between"><span className="inline-flex items-center gap-2"><SlidersHorizontal className="size-4 text-slate-500" />Phong tam</span>{stepper(bathrooms, 0, 10, setBathrooms)}</div>
                </div>
              ) : null}

              {group.options?.map((option) => (
                <label key={option.key} className="flex cursor-pointer items-start gap-2 text-sm text-slate-800">
                  <input type="checkbox" checked={Boolean(checkedMap[option.key])} onChange={() => toggleCheckbox(option.key)} className="mt-0.5 h-4 w-4 rounded border-slate-400 text-[#1f8fce] focus:ring-[#1f8fce]" />
                  <span className="flex-1">{option.label}</span>
                  {typeof option.count === "number" ? <span className="text-slate-500">{option.count}</span> : null}
                </label>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );

  return (
    <main className="min-h-screen bg-[#eef3f7] text-slate-900">
      <SharedTopMenu compact={isHeaderCompact} />

      <section
        className={`fixed left-0 right-0 z-50 w-full border-y border-slate-200 bg-white/95 shadow-[0_8px_20px_rgba(15,45,70,0.08)] transition-all duration-300 ${
          isHeaderCompact ? "top-[64px]" : "top-[76px]"
        }`}
      >
        <div className={`mx-auto w-full max-w-6xl px-4 transition-all duration-300 ${isHeaderCompact ? "py-2.5" : "py-4"}`}>
          <form ref={searchRef} onSubmit={submitSearch} className="grid items-start gap-2 lg:grid-cols-[auto_2.3fr_1.9fr_1.7fr_auto]">
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-[#8fc8db] bg-gradient-to-b from-[#dff2f8] to-[#b8dfec] text-[#2f748b] shadow-[0_8px_18px_rgba(64,123,145,0.26)] transition hover:-translate-y-[1px] hover:from-[#e8f7fc] hover:to-[#c8e8f2]"
            >
              <AlignJustify className="size-5" />
            </button>

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
                          setDestinationFromQuery("");
                          setIsDestinationOpen(false);
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
              <button type="button" onClick={() => toggleSearchDropdown("date")} className={SEARCH_DATE_TRIGGER}>
                <CalendarDays className="size-4 text-slate-500" />
                <span className="truncate text-sm font-semibold">{dateLabel}</span>
                <ChevronDown className="ml-auto size-4 text-slate-500" />
              </button>
              <p className="px-1 pt-1 text-xs text-slate-500">{stayDurationLabel}</p>
              {isDateOpen ? (
                <DropdownPanel className={DATE_PANEL_CLASS}>
                  <p className="mb-2 text-center text-sm font-medium text-[#5a9aac]">Lich</p>
                  <div className="mb-3 flex items-center justify-between border-t border-[#8fb9c5] pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        setDisplayMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
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
                        setDisplayMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))
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
                      const isStart = iso === checkIn;
                      const isEnd = iso === checkOut;
                      const isInRange = Boolean(checkIn) && Boolean(checkOut) && iso > checkIn && iso < checkOut;

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
              Tim khach san
            </button>
          </form>
        </div>
      </section>

      <section
        className={`mx-auto w-full max-w-6xl px-4 pb-4 transition-all duration-300 ${
          isHeaderCompact ? "pt-[150px]" : "pt-[168px]"
        }`}
      >
        <div className={`flex items-start transition-all duration-300 ${isFilterDrawerOpen ? "gap-4" : "gap-0"}`}>
          <aside
            className={`shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-[#f4f7fb] shadow-sm transition-all duration-300 ${
              isFilterDrawerOpen ? "w-[360px] opacity-100" : "w-0 border-transparent opacity-0"
            }`}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
              <h3 className="text-lg font-bold text-slate-900">Bo loc</h3>
              <button type="button" onClick={() => setIsFilterDrawerOpen(false)} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100">
                <X className="size-5" />
              </button>
            </div>
            <div className="max-h-[calc(100vh-210px)] overflow-y-auto">{filterSidebarContent}</div>
          </aside>

          <div className="min-w-0 flex-1 space-y-4 transition-all duration-300">
          <header className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Trang chu &gt; Viet Nam &gt; Ket qua tim kiem</p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-[44px] leading-tight font-extrabold text-[#0b2752]">
                {destinationLabel || "Da Lat"}: {hotels.length} cho nghi phu hop voi tim kiem
              </h1>
              <button type="button" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                Sap xep theo: Pho bien nhat
              </button>
            </div>
          </header>

          <div
            className={
              isFilterDrawerOpen
                ? "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
                : "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            }
          >
            {hotelGridItems.map((hotel, index) => (
              <article key={`${hotel.id}-${index}`} className="flex h-full flex-col overflow-hidden rounded-xl border border-[#bfd8ec] bg-white shadow-sm">
                <div className="relative">
                  <img src={hotel.image} alt={hotel.name} className="h-56 w-full object-cover" />
                  <button
                    type="button"
                    className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-full bg-white text-slate-500 shadow-md"
                    aria-label="Luu yeu thich"
                  >
                    <Heart className="size-3.5" />
                  </button>
                </div>

                <div className="flex h-full flex-col space-y-1.5 p-2.5">
                  <h2 className="line-clamp-2 text-[13px] font-bold leading-snug text-[#0d63c8]">{hotel.name}</h2>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="inline-flex items-center rounded bg-[#1458b8] px-1.5 py-0.5 text-xs font-bold text-white">
                      {hotel.rating}
                    </span>
                    <span className="text-slate-600">{hotel.reviews}</span>
                  </div>
                  <p className="text-[12px] text-slate-700">
                    <span className="font-semibold text-[#0d63c8]">{hotel.area}</span> - {hotel.distance}
                  </p>
                  <div className="space-y-1 border-b border-slate-200 pb-2 text-[12px]">
                    {hotel.perks.map((perk) => (
                      <p key={`${hotel.id}-${perk}`} className="inline-flex items-center gap-1.5 text-[#138145]">
                        <Star className="size-3 fill-current" /> {perk}
                      </p>
                    ))}
                  </div>

                  <div className="mt-auto pt-1 text-right">
                    <p className="text-[11px] text-slate-500">1 dem, 2 nguoi lon</p>
                    <p className="text-[11px] text-slate-400 line-through">{hotel.oldPrice}</p>
                    <p className="whitespace-nowrap text-[27px] font-normal leading-none tracking-tight text-slate-900">
                      VND {hotel.price.replace(" VND", "")}
                    </p>
                    <p className="text-[11px] text-slate-500">Da bao gom thue va phi</p>
                    <button
                      type="button"
                      className="mt-2 rounded-lg bg-[#0b77d0] px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-[#0966b4]"
                    >
                      Xem cho trong
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          </div>
        </div>
      </section>
    </main>
  );
}
