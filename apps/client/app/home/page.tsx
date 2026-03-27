"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BedDouble,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  House,
  Map,
  Search,
  ShieldCheck,
  SquareUserRound,
  Users,
} from "lucide-react";

const supportCards = [
  {
    title: "Tim kiem",
    desc: "Tim nha o theo khu vuc, gia va nhu cau luu tru.",
    icon: Search,
  },
  {
    title: "Tham can ho",
    desc: "Dat lich tham quan truc tiep voi chu nha nhanh gon.",
    icon: Map,
  },
  {
    title: "Hop dong",
    desc: "Ky hop dong minh bach va luu tru ho so an toan.",
    icon: ShieldCheck,
  },
  {
    title: "Chuyen vao o",
    desc: "Ho tro nhan nha va bat dau ky luu tru de dang.",
    icon: House,
  },
];

const partnerCards = [
  {
    title: "FOR LANDLORDS",
    subtitle: "Quan ly tai san hieu qua",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "FOR AGENTS",
    subtitle: "Hop tac moi gioi ben vung",
    image:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "DECOR AGENTS",
    subtitle: "Toi uu setup can ho cho thue",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=700&q=80",
  },
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

export default function HomeManagementPage() {
  const [provinces, setProvinces] = useState<ProvinceItem[]>([]);
  const [districts, setDistricts] = useState<DistrictItem[]>([]);
  const [wards, setWards] = useState<WardItem[]>([]);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
  const [selectedDistrictCode, setSelectedDistrictCode] = useState("");
  const [selectedWardCode, setSelectedWardCode] = useState("");
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
  const [displayMonth, setDisplayMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

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
  const guestDisplayLabel = `${adults} nguoi lon - ${children} tre em - ${rooms} phong - ${beds} giuong`;

  const monthTitle = displayMonth.toLocaleDateString("vi-VN", {
    month: "long",
    year: "numeric",
  });
  const monthStartWeekday = (displayMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 0).getDate();
  const dayLabels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

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

  return (
    <main className="min-h-screen bg-[#f1f4f5] text-slate-900">
      <section
        className="relative min-h-[74vh] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1470004914212-05527e49370b?auto=format&fit=crop&w=2200&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,62,83,0.34)_0%,rgba(31,62,83,0.12)_25%,rgba(31,62,83,0.26)_100%)]" />

        <header className="relative z-10 border-t-4 border-[#8cc9d8] bg-white/92 shadow-[0_8px_22px_rgba(47,93,109,0.18)]">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 lg:px-8">
            <div className="flex items-center gap-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-gradient-to-b from-[#8ecad8] to-[#5da7bb] text-white shadow-[0_10px_18px_rgba(78,131,149,0.38)]">
                <Building2 className="size-6" />
              </div>
              <nav className="hidden items-center gap-4 text-xs text-slate-600 md:flex">
                <Link href="/home" className="font-semibold text-[#5a9aac]">
                  Trang chu
                </Link>
                <a href="#" className="hover:text-[#5a9aac]">
                  Ve chung toi
                </a>
                <a href="#" className="hover:text-[#5a9aac]">
                  Chon nha
                </a>
                <a href="#" className="hover:text-[#5a9aac]">
                  Doi tac
                </a>
                <a href="#" className="hover:text-[#5a9aac]">
                  Lien he
                </a>
              </nav>
            </div>
            <div className="hidden items-center gap-2 text-xs text-slate-500 md:flex">
              <SquareUserRound className="size-4" />
              <Link href="/login" className="hover:text-[#5a9aac]">
                Dang nhap he thong
              </Link>
            </div>
          </div>
        </header>

        <div className="relative z-10 mx-auto flex w-full max-w-6xl justify-center px-4 pb-24 pt-28 lg:px-8">
          <div
            className="w-full max-w-[980px] rounded-xl border-2 p-2"
            style={{
              backgroundColor: `rgba(0,0,0,${SMART_SEARCH_BG_OPACITY ?? 0.2})`,
              borderColor: `rgba(156,214,228,${SMART_SEARCH_BORDER_OPACITY ?? 0.9})`,
              boxShadow: `0 22px 48px rgba(0,0,0,${Math.min(0.75, (SMART_SEARCH_BG_OPACITY ?? 0.2) + 0.25)}), inset 0 1px 0 rgba(255,255,255,0.06)`,
            }}
          >
            <p className="mb-2 text-center text-xs font-semibold text-[#5a9aac]">Tim kiem thong minh</p>
            <form className="grid gap-2 lg:grid-cols-[2.3fr_1.9fr_1.7fr_auto]">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsLocationOpen((open) => !open)}
                  className="flex h-11 w-full items-center gap-2 rounded-md border border-[#b9ced6] bg-white/95 px-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
                >
                  <BedDouble className="size-4 text-slate-500" />
                  <span className="text-sm font-semibold text-slate-800">{destinationLabel}</span>
                  <ChevronDown className="ml-auto size-4 text-slate-500" />
                </button>
                {isLocationOpen ? (
                  <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 rounded-md border border-slate-200 bg-white p-3 shadow-lg">
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
                  </div>
                ) : null}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDateOpen((open) => !open)}
                  className="flex h-11 w-full items-center gap-2 rounded-md border border-[#b9ced6] bg-white/95 px-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
                >
                  <CalendarDays className="size-4 text-slate-500" />
                  <span className="text-sm font-semibold text-slate-800">{dateDisplayLabel}</span>
                  <ChevronDown className="ml-auto size-4 text-slate-500" />
                </button>
                {isDateOpen ? (
                  <div className="absolute left-1/2 top-[calc(100%+6px)] z-30 w-[430px] -translate-x-1/2 rounded-md border border-slate-200 bg-white p-4 shadow-lg">
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
                  </div>
                ) : null}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsGuestOpen((open) => !open)}
                  className="flex h-11 w-full items-center gap-2 rounded-md border-2 border-[#8bc8d8] bg-white/95 px-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]"
                >
                  <Users className="size-4 text-slate-500" />
                  <span className="text-sm font-semibold text-slate-800">{guestDisplayLabel}</span>
                  <ChevronDown className="ml-auto size-4 text-slate-500" />
                </button>
                {isGuestOpen ? (
                  <div className="absolute left-1/2 top-[calc(100%+6px)] z-30 w-[215px] -translate-x-1/2 rounded-md border border-slate-200 bg-white p-3 shadow-lg">
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
                  </div>
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

      <section className="border-t border-slate-300 bg-[#f7f8f8] py-8">
        <div className="mx-auto w-full max-w-6xl px-4 lg:px-8">
          <h2 className="text-center text-[30px] font-bold tracking-wide text-slate-800">Tan huong chuyen du lich cung chung toi</h2>
          <div className="mx-auto mt-1 h-[2px] w-14 bg-[#9fc8d3]" />

          <div className="mt-8 grid gap-5 md:grid-cols-4">
            {supportCards.map((item) => (
              <article key={item.title} className="text-center">
                <item.icon className="mx-auto size-6 text-[#5a9aac]" />
                <h3 className="mt-2 text-lg font-medium text-slate-800">{item.title}</h3>
                <p className="mx-auto mt-1 max-w-[230px] text-xs leading-5 text-slate-500">{item.desc}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {partnerCards.map((item) => (
              <article key={item.title} className="overflow-hidden border border-slate-200 bg-white shadow-sm">
                <div
                  className="h-28 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${item.image}')`,
                  }}
                />
                <div className="bg-gradient-to-r from-[#5ea7ba] to-[#7fc3d2] px-3 py-2 text-white">
                  <p className="text-xs font-bold tracking-wide">{item.title}</p>
                  <p className="text-[11px] text-white/90">{item.subtitle}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
