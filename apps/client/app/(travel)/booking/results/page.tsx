"use client";

import { Suspense, type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
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
import SharedSearchShell from "@/components/booking/shared-search-shell";
import DestinationRequiredMessage from "@/components/ui/destination-required-message";
import DropdownPanel from "@/components/ui/dropdown-panel";
import { Slider } from "@/components/ui/slider";
import useOutsideDismiss from "@/components/ui/use-outside-dismiss";
import {
  Baby,
  BedDouble,
  BedSingle,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  DoorOpen,
  Funnel,
  Heart,
  MapPin,
  Minus,
  Plus,
  SlidersHorizontal,
  ArrowUpDown,
  Grip,
  List,
  Star,
  UserRound,
  X,
} from "lucide-react";

export const dynamic = "force-dynamic";

type ResultViewMode = "horizontal" | "vertical";
type SortOption = { key: string; label: string };

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
  searchableLocations: string[];
  maxGuestsPerRoom: number;
  filterTags: string[];
};

const RESULTS_DESTINATION_REQUIRED_MESSAGE = "Vui lòng nhập điểm đến để bắt đầu tìm kiếm.";
const sortOptions: SortOption[] = [
  { key: "recommended", label: "Phù hợp nhất trước" },
  { key: "home-priority", label: "Ưu tiên nhà & căn hộ" },
  { key: "near-center", label: "Khoảng cách đến bãi biển gần nhất" },
  { key: "price-desc", label: "Giá (ưu tiên cao nhất)" },
  { key: "rating-desc", label: "Xếp hạng chỗ nghỉ (cao đến thấp)" },
  { key: "rating-asc", label: "Xếp hạng chỗ nghỉ (thấp đến cao)" },
  { key: "central-first", label: "Ở vị trí trung tâm trước" },
  { key: "top-reviewed", label: "Được đánh giá hàng đầu" },
];

const hotels: HotelItem[] = [
  {
    id: "ecotime-villa-da-lat",
    name: "ECOTIME Villa Đà Lạt",
    area: "Đà Lạt",
    distance: "Cách trung tâm 2,8km",
    rating: "7,8",
    reviews: "65 đánh giá",
    price: "252.720 VND",
    oldPrice: "520.000 VND",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
    perks: ["Miễn phí hủy", "Không cần thanh toán trước"],
    searchableLocations: ["Đà Lạt", "Lâm Đồng"],
    maxGuestsPerRoom: 2,
    filterTags: ["free-cancel", "pay-later", "villa", "wifi", "private-bath", "double-bed", "distance-3", "distance-5", "3-star", "fav-zone"],
  },
  {
    id: "elc-luxury-da-lat",
    name: "ELC Luxury Đà Lạt Hotel & Apartment",
    area: "Đà Lạt",
    distance: "Cách trung tâm 0,7km",
    rating: "8,2",
    reviews: "42 đánh giá",
    price: "1.445.850 VND",
    oldPrice: "1.912.500 VND",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
    perks: ["Bao bữa sáng", "Không cần thanh toán trước"],
    searchableLocations: ["Đà Lạt", "Lâm Đồng"],
    maxGuestsPerRoom: 4,
    filterTags: ["breakfast", "pay-later", "hotel", "parking", "wifi", "aircon", "private-bath", "double-bed", "4-star", "distance-1", "distance-3", "brand-marriott"],
  },
  {
    id: "an-phu-home",
    name: "AN PHU Home",
    area: "Đà Lạt",
    distance: "Cách trung tâm 2,9km",
    rating: "9,4",
    reviews: "284 đánh giá",
    price: "792.000 VND",
    oldPrice: "900.000 VND",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    perks: ["Phòng có giường King", "Cảnh núi đẹp"],
    searchableLocations: ["Đà Lạt", "Lâm Đồng"],
    maxGuestsPerRoom: 3,
    filterTags: ["apartment", "wifi", "balcony", "private-bath", "double-bed", "distance-3", "distance-5", "fav-zone"],
  },
  {
    id: "sapa-cloud-hotel",
    name: "Sapa Cloud Hotel",
    area: "Lào Cai",
    distance: "Cách trung tâm Sa Pa 0,4km",
    rating: "8,9",
    reviews: "156 đánh giá",
    price: "1.120.000 VND",
    oldPrice: "1.450.000 VND",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    perks: ["View núi", "Bao bữa sáng"],
    searchableLocations: ["Lào Cai", "Sa Pa", "Sapa"],
    maxGuestsPerRoom: 2,
    filterTags: ["breakfast", "hotel", "wifi", "aircon", "private-bath", "double-bed", "4-star", "distance-1", "fav-zone"],
  },
  {
    id: "catcat-riverside-resort",
    name: "Cat Cat Riverside Resort",
    area: "Lào Cai",
    distance: "Cách bản Cát Cát 1,2km",
    rating: "9,1",
    reviews: "203 đánh giá",
    price: "1.680.000 VND",
    oldPrice: "2.050.000 VND",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    perks: ["Miễn phí hủy", "Xe đưa đón"],
    searchableLocations: ["Lào Cai", "Sa Pa", "Sapa", "Cát Cát"],
    maxGuestsPerRoom: 4,
    filterTags: ["free-cancel", "resort", "parking", "pool", "spa", "wifi", "balcony", "private-bath", "5-star", "distance-3", "distance-5", "fav-zone"],
  },
  {
    id: "fansipan-view-homestay",
    name: "Fansipan View Homestay",
    area: "Lào Cai",
    distance: "Cách trung tâm Sa Pa 1,8km",
    rating: "8,6",
    reviews: "88 đánh giá",
    price: "890.000 VND",
    oldPrice: "1.100.000 VND",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    perks: ["Cảnh núi đẹp", "Không cần thanh toán trước"],
    searchableLocations: ["Lào Cai", "Sa Pa", "Sapa", "Fansipan"],
    maxGuestsPerRoom: 3,
    filterTags: ["pay-later", "homestay", "wifi", "balcony", "private-bath", "double-bed", "distance-3", "distance-5"],
  },
  {
    id: "hanoi-lakeside-boutique",
    name: "Hanoi Lakeside Boutique Hotel",
    area: "Hà Nội",
    distance: "Cách Hồ Hoàn Kiếm 0,3km",
    rating: "8,7",
    reviews: "312 đánh giá",
    price: "1.350.000 VND",
    oldPrice: "1.620.000 VND",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    perks: ["Trung tâm phố cổ", "Bao bữa sáng"],
    searchableLocations: ["Hà Nội", "Hoàn Kiếm", "Hanoi"],
    maxGuestsPerRoom: 2,
    filterTags: ["breakfast", "hotel", "wifi", "aircon", "private-bath", "double-bed", "4-star", "distance-1", "fav-zone", "brand-sheraton"],
  },
  {
    id: "westlake-residence",
    name: "Westlake Residence Hanoi",
    area: "Hà Nội",
    distance: "Cách Hồ Tây 1,1km",
    rating: "9,0",
    reviews: "141 đánh giá",
    price: "1.780.000 VND",
    oldPrice: "2.120.000 VND",
    image: "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=1200&q=80",
    perks: ["Căn hộ rộng", "Miễn phí hủy"],
    searchableLocations: ["Hà Nội", "Tây Hồ", "Hanoi"],
    maxGuestsPerRoom: 4,
    filterTags: ["free-cancel", "apartment", "parking", "pool", "wifi", "balcony", "private-bath", "aircon", "5-star", "distance-3", "distance-5"],
  },
  {
    id: "old-quarter-family-suite",
    name: "Old Quarter Family Suite",
    area: "Hà Nội",
    distance: "Cách chợ Đồng Xuân 0,6km",
    rating: "8,4",
    reviews: "97 đánh giá",
    price: "1.540.000 VND",
    oldPrice: "1.830.000 VND",
    image: "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1200&q=80",
    perks: ["Phù hợp gia đình", "Không cần thanh toán trước"],
    searchableLocations: ["Hà Nội", "Phố cổ", "Hoàn Kiếm", "Hanoi"],
    maxGuestsPerRoom: 3,
    filterTags: ["pay-later", "hotel", "wifi", "aircon", "private-bath", "twin-bed", "3-star", "distance-1", "distance-3"],
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
  { id: "popular", title: "Lọc phổ biến", options: [{ key: "free-cancel", label: "Miễn phí hủy", count: 540 }, { key: "pay-later", label: "Không cần thanh toán trước", count: 330 }, { key: "breakfast", label: "Bao gồm bữa sáng", count: 155 }] },
  { id: "location", title: "Địa điểm", custom: "location" },
  { id: "meal", title: "Bữa ăn", options: [{ key: "meal-breakfast", label: "Bao gồm bữa sáng", count: 65 }, { key: "meal-all", label: "Tất cả các bữa", count: 1 }, { key: "meal-self", label: "Tự nấu", count: 83 }] },
  { id: "property", title: "Loại chỗ ở", options: [{ key: "hotel", label: "Khách sạn", count: 100 }, { key: "apartment", label: "Căn hộ", count: 61 }, { key: "resort", label: "Resort", count: 10 }, { key: "villa", label: "Biệt thự", count: 7 }, { key: "homestay", label: "Chỗ nghỉ nhà dân", count: 4 }] },
  { id: "room-bed", title: "Phòng và giường", custom: "roomBed" },
  { id: "amenities", title: "Tiện nghi", options: [{ key: "parking", label: "Chỗ đỗ xe", count: 149 }, { key: "pool", label: "Hồ bơi", count: 123 }, { key: "spa", label: "Trung tâm Spa", count: 55 }, { key: "wifi", label: "WiFi miễn phí", count: 157 }] },
  { id: "room-amenities", title: "Tiện nghi phòng", options: [{ key: "sea-view", label: "Nhìn ra biển", count: 105 }, { key: "balcony", label: "Ban công", count: 138 }, { key: "private-bath", label: "Phòng tắm riêng", count: 162 }, { key: "aircon", label: "Điều hòa không khí", count: 168 }] },
  { id: "star", title: "Xếp hạng chỗ nghỉ", options: [{ key: "5-star", label: "5 sao", count: 47 }, { key: "4-star", label: "4 sao", count: 38 }, { key: "3-star", label: "3 sao", count: 36 }, { key: "2-star", label: "2 sao", count: 5 }, { key: "1-star", label: "1 sao", count: 2 }] },
  { id: "bed-option", title: "Tùy chọn giường", options: [{ key: "double-bed", label: "Giường đôi", count: 165 }, { key: "twin-bed", label: "Hai giường đơn", count: 54 }] },
  { id: "zone", title: "Khu vực", options: [{ key: "fav-zone", label: "Khu vực khách thích", count: 90 }, { key: "ward-3", label: "Phường 3", count: 291 }] },
  { id: "policy", title: "Chính sách đặt phòng", options: [{ key: "policy-no-prepay", label: "Không cần thanh toán trước", count: 129 }, { key: "policy-no-cc", label: "Đặt phòng không cần thẻ tín dụng", count: 99 }, { key: "policy-free-cancel", label: "Miễn phí hủy", count: 27 }] },
  { id: "distance", title: "Khoảng cách trung tâm", options: [{ key: "distance-1", label: "Dưới 1 km", count: 72 }, { key: "distance-3", label: "Dưới 3 km", count: 113 }, { key: "distance-5", label: "Dưới 5 km", count: 146 }] },
  { id: "brand", title: "Thương hiệu", options: [{ key: "brand-muong-thanh", label: "Mường Thanh Hospitality", count: 4 }, { key: "brand-intercontinental", label: "InterContinental Hotels & Resorts", count: 2 }, { key: "brand-marriott", label: "Marriott Hotels & Resorts", count: 1 }, { key: "brand-sheraton", label: "Sheraton", count: 1 }] },
  { id: "accessible-room", title: "Tiện nghi cho người khuyết tật (phòng)", options: [{ key: "acc-rollin", label: "Phòng tắm tiếp cận người khuyết tật", count: 19 }, { key: "acc-elevator", label: "Các tầng trên đi lên bằng thang máy", count: 78 }, { key: "acc-ground", label: "Hoàn toàn nằm ở tầng trệt", count: 16 }, { key: "acc-wheelchair", label: "Xe lăn có thể đi đến mọi nơi trong toàn bộ khách sạn", count: 62 }] },
];

const PROVINCES_API_BASE_URL = "https://provinces.open-api.vn/api";
const PRICE_RANGE_MIN = 0;
const PRICE_RANGE_MAX = 30000000;
const PRICE_RANGE_STEP = 100000;
const TARGET_RESULT_COUNT = 10;

const parseNumber = (value: string | null, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeSearchText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();

const formatCurrencyVnd = (value: number) =>
  `${new Intl.NumberFormat("vi-VN").format(value)} VND`;

const formatCurrencyNumber = (value: number) =>
  new Intl.NumberFormat("vi-VN").format(value);

const getHotelPriceValue = (value: string) => Number.parseInt(value.replace(/[^\d]/g, ""), 10) || 0;
const getHotelRatingValue = (value: string) => Number.parseFloat(value.replace(",", ".")) || 0;
const getHotelReviewCount = (value: string) => Number.parseInt(value.replace(/[^\d]/g, ""), 10) || 0;
const getHotelDistanceValue = (value: string) => Number.parseFloat(value.replace(",", ".")) || 999;
const getHotelDiscountPercent = (price: string, oldPrice: string) => {
  const currentPrice = getHotelPriceValue(price);
  const previousPrice = getHotelPriceValue(oldPrice);
  if (previousPrice <= currentPrice || previousPrice <= 0) return 0;
  return Math.round(((previousPrice - currentPrice) / previousPrice) * 100);
};

function BookingResultsPageContent() {
  const RESULTS_SEARCH_EXPANDED_HEIGHT = 92;
  const RESULTS_SEARCH_COMPACT_HEIGHT = 74;
  const RESULTS_SEARCH_COMPACT_THRESHOLD = 72;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  const searchRef = useRef<HTMLFormElement | null>(null);
  const sortRef = useRef<HTMLDivElement | null>(null);

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
  const [isSearchBarCompact, setIsSearchBarCompact] = useState(false);
  const [resultViewMode, setResultViewMode] = useState<ResultViewMode>("horizontal");
  const [isResultViewAnimating, setIsResultViewAnimating] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSortKey, setSelectedSortKey] = useState<SortOption["key"]>("recommended");
  const [priceRangeMin, setPriceRangeMin] = useState(PRICE_RANGE_MIN);
  const [priceRangeMax, setPriceRangeMax] = useState(PRICE_RANGE_MAX);
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
    const syncSearchBarHeight = () => {
      const nextCompact = window.scrollY > RESULTS_SEARCH_COMPACT_THRESHOLD;
      setIsSearchBarCompact(nextCompact);
      document.documentElement.style.setProperty(
        "--results-search-bar-height",
        `${nextCompact ? RESULTS_SEARCH_COMPACT_HEIGHT : RESULTS_SEARCH_EXPANDED_HEIGHT}px`,
      );
    };

    syncSearchBarHeight();
    window.addEventListener("scroll", syncSearchBarHeight, { passive: true });

    return () => {
      window.removeEventListener("scroll", syncSearchBarHeight);
    };
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

  useOutsideDismiss({
    containerRef: sortRef,
    isActive: isSortOpen,
    onDismiss: () => setIsSortOpen(false),
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
      : selectedProvince?.name ?? (destinationFromQuery || "Bạn muốn đến đâu?");

  const monthTitle = displayMonth.toLocaleDateString("vi-VN", {
    month: "long",
    year: "numeric",
  });
  const monthStartWeekday = (displayMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 0).getDate();
  const dayLabels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  const stayDurationLabel = useMemo(() => {
    if (!checkIn || !checkOut) return "Thời gian: Chưa chọn";
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const nights = Math.max(1, Math.round((outDate.getTime() - inDate.getTime()) / 86400000));
    return `Thời gian: ${nights} đêm`;
  }, [checkIn, checkOut]);

  const dateLabel =
    checkIn && checkOut
      ? `${new Date(checkIn).toLocaleDateString("vi-VN")} - ${new Date(checkOut).toLocaleDateString("vi-VN")}`
      : "Nhận phòng - Trả phòng";
  const hasSearchDestination = Boolean(
    selectedProvinceCode || selectedDistrictCode || selectedWardCode || destinationFromQuery.trim(),
  );
  const normalizedDestination = hasSearchDestination ? normalizeSearchText(destinationLabel) : "";
  const guestsPerRoom = Math.max(1, Math.ceil((adults + children) / Math.max(rooms, 1)));
  const filteredHotels = useMemo(() => {
    const destinationMatches = normalizedDestination
      ? hotels.filter((hotel) =>
          hotel.searchableLocations.some((location) => {
            const normalizedLocation = normalizeSearchText(location);
            return (
              normalizedDestination.includes(normalizedLocation) ||
              normalizedLocation.includes(normalizedDestination)
            );
          }),
        )
      : hotels;

    const capacityMatches = destinationMatches.filter(
      (hotel) => hotel.maxGuestsPerRoom >= guestsPerRoom,
    );

    if (capacityMatches.length > 0) return capacityMatches;
    if (destinationMatches.length > 0) return destinationMatches;
    return hotels.slice(0, 3);
  }, [guestsPerRoom, normalizedDestination]);
  const activeFilterKeys = useMemo(
    () => Object.entries(checkedMap).filter(([, checked]) => checked).map(([key]) => key),
    [checkedMap],
  );
  const activeFiltersByGroup = useMemo(() => {
    const grouped = new Map<string, string[]>();

    for (const key of activeFilterKeys) {
      const group = filterGroups.find((item) => item.options?.some((option) => option.key === key));
      if (!group) continue;
      const current = grouped.get(group.id) ?? [];
      current.push(key);
      grouped.set(group.id, current);
    }

    return grouped;
  }, [activeFilterKeys]);
  const visibleHotels = useMemo(() => {
    return filteredHotels.filter((hotel) => {
      const matchesPrice =
        getHotelPriceValue(hotel.price) >= priceRangeMin && getHotelPriceValue(hotel.price) <= priceRangeMax;
      if (!matchesPrice) return false;

      for (const [, keys] of activeFiltersByGroup) {
        if (!keys.some((key) => hotel.filterTags.includes(key))) {
          return false;
        }
      }

      return true;
    });
  }, [activeFiltersByGroup, filteredHotels, priceRangeMax, priceRangeMin]);
  const selectedSort = sortOptions.find((option) => option.key === selectedSortKey) ?? sortOptions[0];
  const sortedHotels = useMemo(() => {
    const items = [...visibleHotels];

    switch (selectedSortKey) {
      case "home-priority":
        return items.sort((a, b) => {
          const aPriority = Number(a.name.includes("Apartment") || a.name.includes("Home"));
          const bPriority = Number(b.name.includes("Apartment") || b.name.includes("Home"));
          return bPriority - aPriority;
        });
      case "near-center":
      case "central-first":
        return items.sort((a, b) => getHotelDistanceValue(a.distance) - getHotelDistanceValue(b.distance));
      case "price-desc":
        return items.sort((a, b) => getHotelPriceValue(b.price) - getHotelPriceValue(a.price));
      case "rating-desc":
        return items.sort((a, b) => getHotelRatingValue(b.rating) - getHotelRatingValue(a.rating));
      case "rating-asc":
        return items.sort((a, b) => getHotelRatingValue(a.rating) - getHotelRatingValue(b.rating));
      case "top-reviewed":
        return items.sort((a, b) => getHotelReviewCount(b.reviews) - getHotelReviewCount(a.reviews));
      default:
        return items;
    }
  }, [selectedSortKey, visibleHotels]);
  const displayHotels = useMemo(() => {
    if (sortedHotels.length === 0) return [];
    if (sortedHotels.length >= TARGET_RESULT_COUNT) return sortedHotels;

    return Array.from({ length: TARGET_RESULT_COUNT }, (_, index) => ({
      ...sortedHotels[index % sortedHotels.length],
    }));
  }, [sortedHotels]);

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

  const handleResultViewModeChange = (nextMode: ResultViewMode) => {
    if (nextMode === resultViewMode) return;

    setIsResultViewAnimating(true);
    setResultViewMode(nextMode);
  };

  const handlePriceRangeChange = (nextRange: number[]) => {
    const [nextMin = PRICE_RANGE_MIN, nextMax = PRICE_RANGE_MAX] = nextRange;

    setPriceRangeMin(nextMin);
    setPriceRangeMax(nextMax);
  };

  useEffect(() => {
    if (!isResultViewAnimating) return;

    const timeoutId = window.setTimeout(() => {
      setIsResultViewAnimating(false);
    }, 520);

    return () => window.clearTimeout(timeoutId);
  }, [isResultViewAnimating]);

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
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-[1.12rem] font-bold text-slate-900">Khoảng giá</h3>
          <button
            type="button"
            onClick={() => {
              setPriceRangeMin(PRICE_RANGE_MIN);
              setPriceRangeMax(PRICE_RANGE_MAX);
            }}
            className="text-[0.95rem] font-bold text-[#0095ff]"
          >
            Đặt lại
          </button>
        </div>
        <div className="mt-5 px-1">
          <Slider
            value={[priceRangeMin, priceRangeMax]}
            min={PRICE_RANGE_MIN}
            max={PRICE_RANGE_MAX}
            step={PRICE_RANGE_STEP}
            minStepsBetweenThumbs={1}
            onValueChange={handlePriceRangeChange}
            className="w-full"
          />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center overflow-hidden rounded-full border border-[#cfd6dd] bg-white text-[0.72rem] font-semibold text-slate-900 shadow-sm">
            <span className="px-3 py-[7px]">{formatCurrencyNumber(priceRangeMin)}</span>
            <span className="pl-2.5 pr-3 py-[7px] text-[0.68rem] font-medium text-slate-700">VND</span>
          </div>
          <div className="flex min-w-0 items-center overflow-hidden rounded-full border border-[#cfd6dd] bg-white text-[0.72rem] font-semibold text-slate-900 shadow-sm">
            <span className="px-3 py-[7px]">{formatCurrencyNumber(priceRangeMax)}</span>
            <span className="pl-2.5 pr-3 py-[7px] text-[0.68rem] font-medium text-slate-700">VND</span>
          </div>
        </div>
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
                  <p className="text-sm text-slate-600">Địa danh hoặc sân bay</p>
                  <input value={filterKeyword} onChange={(event) => setFilterKeyword(event.target.value)} placeholder="Ví dụ: Bảo tàng, nhà ga" className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#53a8cb]" />
                  <select value={distanceRadius} onChange={(event) => setDistanceRadius(event.target.value)} className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#53a8cb]">
                    <option>1 km</option>
                    <option>3 km</option>
                    <option>5 km</option>
                  </select>
                </>
              ) : null}

              {group.custom === "roomBed" ? (
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between"><span className="inline-flex items-center gap-2"><BedDouble className="size-4 text-slate-500" />Phòng ngủ</span>{stepper(rooms, 0, 10, setRooms)}</div>
                  <div className="flex items-center justify-between"><span className="inline-flex items-center gap-2"><BedSingle className="size-4 text-slate-500" />Giường</span>{stepper(beds, 0, 20, setBeds)}</div>
                  <div className="flex items-center justify-between"><span className="inline-flex items-center gap-2"><SlidersHorizontal className="size-4 text-slate-500" />Phòng tắm</span>{stepper(bathrooms, 0, 10, setBathrooms)}</div>
                </div>
              ) : null}

              {group.id === "star"
                ? group.options?.map((option) => {
                    const rating = Number.parseInt(option.key, 10) || 0;
                    return (
                      <label key={option.key} className="flex cursor-pointer items-center gap-2 text-sm text-slate-800">
                        <input type="checkbox" checked={Boolean(checkedMap[option.key])} onChange={() => toggleCheckbox(option.key)} className="h-4 w-4 rounded border-slate-400 text-[#1f8fce] focus:ring-[#1f8fce]" />
                        <span className="inline-flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={`${option.key}-${index}`}
                              className={`size-3.5 ${index < rating ? "fill-[#f6a623] text-[#f6a623]" : "text-slate-300"}`}
                            />
                          ))}
                        </span>
                        <span>{option.label}</span>
                      </label>
                    );
                  })
                : group.options?.map((option) => (
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
      <SharedSearchShell
        submitPath={pathname}
        initialDestination={destinationFromQuery || destinationLabel}
        initialCheckIn={checkIn}
        initialCheckOut={checkOut}
        initialAdults={adults}
        initialChildren={children}
        initialRooms={rooms}
        initialBeds={beds}
        onFilterClick={() => setIsFilterDrawerOpen((prev) => !prev)}
      />

      <section className="hidden">
        <div
          className={`mx-auto w-full max-w-6xl px-4 transition-all duration-300 ${
            isSearchBarCompact ? "py-2.5" : "py-4"
          }`}
        >
          <form ref={searchRef} onSubmit={submitSearch} className="grid items-start gap-2 lg:grid-cols-[auto_2.3fr_1.9fr_1.7fr_auto]">
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen((prev) => !prev)}
              className={`inline-flex items-center justify-center rounded-md border border-[#8fc8db] bg-gradient-to-b from-[#dff2f8] to-[#b8dfec] text-[#2f748b] shadow-[0_8px_18px_rgba(64,123,145,0.26)] transition-all duration-300 hover:-translate-y-[1px] hover:from-[#e8f7fc] hover:to-[#c8e8f2] ${
                isSearchBarCompact ? "h-10 w-10" : "h-11 w-11"
              }`}
            >
              <Funnel className={`transition-all duration-300 ${isSearchBarCompact ? "size-[18px]" : "size-5"}`} />
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
                      <option value="">Chọn Tỉnh/Thành phố</option>
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
                      <option value="">Chọn Quận/Huyện</option>
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
                      <option value="">Chọn Phường/Xã</option>
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
              <p
                className={`px-1 text-slate-500 transition-all duration-300 ${
                  isSearchBarCompact ? "pt-0.5 text-[11px]" : "pt-1 text-xs"
                }`}
              >
                {stayDurationLabel}
              </p>
              {isDateOpen ? (
                <DropdownPanel className={DATE_PANEL_CLASS}>
                  <p className="mb-2 text-center text-sm font-medium text-[#5a9aac]">Lịch</p>
                  <div className="mb-3 flex items-center justify-between border-t border-[#8fb9c5] pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        setDisplayMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
                      }
                      className="rounded p-1 text-slate-500 hover:bg-slate-100"
                      aria-label="Tháng trước"
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
                      aria-label="Tháng sau"
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
                    <div className="flex items-center justify-between text-sm"><span>Người lớn</span>{stepper(adults, 1, 20, setAdults)}</div>
                    <div className="flex items-center justify-between text-sm"><span>Trẻ em</span>{stepper(children, 0, 10, setChildren)}</div>
                    <div className="flex items-center justify-between text-sm"><span>Phòng</span>{stepper(rooms, 1, 10, setRooms)}</div>
                    <div className="flex items-center justify-between text-sm"><span>Giường</span>{stepper(beds, 1, 8, setBeds)}</div>
                  </div>
                </DropdownPanel>
              ) : null}
            </div>

            <button type="submit" className={SEARCH_SUBMIT_BUTTON}>
              Tìm khách sạn
            </button>
          </form>
        </div>
      </section>

      <section
        className="mx-auto w-full max-w-6xl px-4 pb-4 transition-all duration-300"
        style={{ paddingTop: "1rem" }}
      >
        <div className={`flex items-start transition-all duration-300 ${isFilterDrawerOpen ? "gap-4" : "gap-0"}`}>
          <aside
            className={`shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-[#f4f7fb] shadow-sm transition-all duration-300 ${
              isFilterDrawerOpen ? "w-[360px] opacity-100" : "w-0 border-transparent opacity-0"
            }`}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
              <h3 className="text-lg font-bold text-slate-900" aria-label="Bộ lọc">
                <SlidersHorizontal className="size-5" />
                <span className="sr-only">Bộ lọc</span>
              </h3>
              <button type="button" onClick={() => setIsFilterDrawerOpen(false)} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100">
                <X className="size-5" />
              </button>
            </div>
            <div className="max-h-[calc(100vh-210px)] overflow-y-auto">{filterSidebarContent}</div>
          </aside>

          <div className="min-w-0 flex-1 space-y-4 transition-all duration-300">
          <header className="p-4">
            <p className="text-sm text-slate-500">Trang chủ &gt; Việt Nam &gt; Kết quả tìm kiếm</p>
            <div className="mt-2 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="min-w-0 flex-1 text-[22px] leading-tight font-extrabold text-[#0b2752]">
                  {destinationLabel || "Đà Lạt"}: {displayHotels.length} chỗ nghỉ phù hợp với tìm kiếm
                </h1>
                <div className="flex shrink-0 items-center justify-end gap-2">
                  <span className="text-sm font-medium text-slate-700">Xem:</span>
                  <div className="relative inline-flex h-10 w-[112px] rounded-full border border-slate-200 bg-white p-1 shadow-sm">
                    <div
                      className={`pointer-events-none absolute top-1 h-8 w-[52px] rounded-full bg-[#d8efff] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-300 ease-out ${
                        resultViewMode === "vertical" ? "left-1" : "left-[56px]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => handleResultViewModeChange("vertical")}
                      aria-pressed={resultViewMode === "vertical"}
                      aria-label="Xem ngang"
                      className={`relative inline-flex h-8 w-[52px] items-center justify-center rounded-full transition ${
                        resultViewMode === "vertical"
                          ? "text-[#0b63c8]"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <Grip className="size-4" strokeWidth={2.2} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleResultViewModeChange("horizontal")}
                      aria-pressed={resultViewMode === "horizontal"}
                      aria-label="Xem dọc"
                      className={`relative inline-flex h-8 w-[52px] items-center justify-center rounded-full transition ${
                        resultViewMode === "horizontal"
                          ? "text-[#0b63c8]"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <List className="size-4" strokeWidth={2.2} />
                    </button>
                  </div>
                </div>
              </div>
              <div ref={sortRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsSortOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#9fc8df] hover:bg-slate-50"
                >
                  <ArrowUpDown className="size-4 text-slate-500" />
                  <span>Sắp xếp theo: {selectedSort.label}</span>
                  <ChevronDown className={`size-4 text-slate-500 transition ${isSortOpen ? "rotate-180" : ""}`} />
                </button>
                {isSortOpen ? (
                  <DropdownPanel className="absolute left-0 top-[calc(100%+10px)] z-30 w-[280px] overflow-hidden rounded-xl border border-[#9fc8df] p-0">
                    {sortOptions.map((option) => (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => {
                          setSelectedSortKey(option.key);
                          setIsSortOpen(false);
                        }}
                        className={`flex w-full items-center px-4 py-3 text-left text-sm transition ${
                          selectedSortKey === option.key
                            ? "bg-[#edf7ff] font-semibold text-[#0b63c8]"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </DropdownPanel>
                ) : null}
              </div>
            </div>
          </header>

          <div
            className={
              `${
                resultViewMode === "horizontal"
                  ? "space-y-3"
                  : isFilterDrawerOpen
                    ? "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
                    : "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              } result-list-transition ${resultViewMode === "horizontal" ? "result-list-horizontal" : "result-list-vertical"} ${
                isResultViewAnimating ? "result-list-morphing" : ""
              }`
            }
          >
            {displayHotels.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-600 shadow-sm">
                Không có chỗ nghỉ phù hợp với bộ lọc hiện tại. Hãy nới rộng khoảng giá hoặc bỏ bớt bộ lọc.
              </div>
            ) : null}
            {displayHotels.map((hotel, index) => (
              <article
                key={`${hotel.id}-${index}`}
                className={`result-hotel-card overflow-hidden rounded-xl border border-[#bfd8ec] bg-white shadow-sm transition-all ${
                  resultViewMode === "horizontal"
                    ? "flex flex-col md:flex-row duration-500 ease-out"
                    : "flex h-full flex-col duration-500 ease-out"
                }`}
              >
                <div
                  className={`result-hotel-media relative ${
                    resultViewMode === "horizontal"
                      ? "md:w-[300px] md:min-w-[300px] lg:w-[320px] lg:min-w-[320px]"
                      : ""
                  }`}
                >
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className={resultViewMode === "horizontal" ? "h-56 w-full object-cover md:h-full" : "h-56 w-full object-cover"}
                  />
                  {getHotelDiscountPercent(hotel.price, hotel.oldPrice) > 0 ? (
                    <div className="absolute bottom-3 right-3 inline-flex items-center rounded-md bg-[#ff7a00] px-2 py-1 text-[11px] font-bold leading-none text-white shadow-[0_8px_18px_rgba(255,122,0,0.28)]">
                      Tiết kiệm {getHotelDiscountPercent(hotel.price, hotel.oldPrice)}%
                    </div>
                  ) : null}
                  <button
                    type="button"
                    className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-full bg-white text-slate-500 shadow-md"
                    aria-label="Lưu yêu thích"
                  >
                    <Heart className="size-3.5" />
                  </button>
                </div>

                <div
                  className={`result-hotel-body flex flex-1 ${
                    resultViewMode === "horizontal"
                      ? "flex-col gap-4 p-4 md:flex-row md:items-start md:justify-between"
                      : "h-full flex-col space-y-1.5 p-2.5"
                  }`}
                >
                  <div className={`result-hotel-content ${resultViewMode === "horizontal" ? "min-w-0 flex-1 space-y-2" : ""}`}>
                    <Link
                      href={`/booking/hotel-details/${hotel.id}${searchKey ? `?${searchKey}` : ""}`}
                      className={
                        resultViewMode === "horizontal"
                          ? "line-clamp-2 block text-xl font-bold leading-snug text-[#0d63c8] hover:underline"
                          : "line-clamp-2 block text-[13px] font-bold leading-snug text-[#0d63c8] hover:underline"
                      }
                    >
                      {hotel.name}
                    </Link>
                    <div className={resultViewMode === "horizontal" ? "flex items-center gap-2 text-sm" : "flex items-center gap-1.5 text-[11px]"}>
                      <span className="font-semibold text-[#f6a623]">{hotel.rating}</span>
                      <span className="text-slate-500">({hotel.reviews})</span>
                    </div>
                    <p className={resultViewMode === "horizontal" ? "text-sm text-slate-700" : "text-[12px] text-slate-700"}>
                      {hotel.area} - {hotel.distance}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {hotel.perks.map((perk) => (
                        <span
                          key={perk}
                          className={
                            resultViewMode === "horizontal"
                              ? "inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                              : "inline-block rounded bg-blue-50 px-2 py-0.5 text-[11px] text-blue-700"
                          }
                        >
                          {perk}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div
                    className={`result-hotel-side ${
                      resultViewMode === "horizontal"
                        ? "flex shrink-0 flex-row items-end justify-between gap-4 border-t border-slate-100 pt-3 md:w-[180px] md:flex-col md:items-end md:border-t-0 md:border-l md:pl-4 md:pt-0"
                        : "mt-auto flex items-end justify-between pt-2"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-[11px] line-through text-slate-400">{hotel.oldPrice}</span>
                      <span className={resultViewMode === "horizontal" ? "text-lg font-bold text-slate-900" : "text-sm font-bold text-slate-900"}>{hotel.price}</span>
                    </div>
                    <Link
                      href={`/booking/hotel-details/${hotel.id}${searchKey ? `?${searchKey}` : ""}`}
                      className={
                        resultViewMode === "horizontal"
                          ? "inline-flex h-11 items-center justify-center rounded-full border border-[#d97b49] bg-[#fff1e8] px-5 text-sm font-semibold text-[#a54c1d] shadow-[0_8px_18px_rgba(217,123,73,0.18)] transition hover:-translate-y-[1px] hover:bg-[#ffe7d9]"
                          : "inline-flex size-11 items-center justify-center rounded-full border border-[#d97b49] bg-[#fff1e8] text-lg font-semibold leading-none text-[#a54c1d] shadow-[0_8px_18px_rgba(217,123,73,0.18)] transition hover:-translate-y-[1px] hover:bg-[#ffe7d9]"
                      }
                    >
                      {resultViewMode === "horizontal" ? "Chọn phòng" : ">"}
                    </Link>
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

export default function BookingResultsPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#eef3f7]" />}>
      <BookingResultsPageContent />
    </Suspense>
  );
}
