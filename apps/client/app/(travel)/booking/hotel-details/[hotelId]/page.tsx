import { notFound } from "next/navigation";
import {
  Bath,
  BedDouble,
  Check,
  ChevronRight,
  Clock3,
  Coffee,
  MapPin,
  Maximize2,
  Plane,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wifi,
} from "lucide-react";
import HotelImageGallery from "@/components/booking/hotel-image-gallery";
import HotelDetailTabs from "@/components/booking/hotel-detail-tabs";
import SharedSearchShell from "@/components/booking/shared-search-shell";

type RoomOption = {
  id: string;
  name: string;
  size: string;
  guests: string;
  bed: string;
  perks: string[];
  price: string;
};

type HotelDetail = {
  id: string;
  name: string;
  location: string;
  areaLabel: string;
  rating: string;
  reviews: string;
  price: string;
  oldPrice: string;
  propertyType: string;
  stars: number;
  heroImages: string[];
  highlights: string[];
  amenities: string[];
  nearby: Array<{ label: string; distance: string }>;
  reviewTags: string[];
  reviewExcerpt: string;
  description: string;
  rooms: RoomOption[];
};

const hotelDetails: Record<string, HotelDetail> = {
  "ecotime-villa-da-lat": {
    id: "ecotime-villa-da-lat",
    name: "ECOTIME Villa Da Lat",
    location: "Da Lat, Lam Dong",
    areaLabel: "Cach trung tam 2,8 km",
    rating: "8,3",
    reviews: "3.349 danh gia",
    price: "469.405 VND",
    oldPrice: "520.000 VND",
    propertyType: "Khach san",
    stars: 3,
    heroImages: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1616594039964-3f56d5c74c55?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80",
    ],
    highlights: ["Khong can thanh toan truoc", "WiFi mien phi", "Le tan 24h"],
    amenities: ["May lanh", "WiFi", "Le tan 24h", "Cho dau xe", "Ban cong", "Dua don san bay"],
    nearby: [
      { label: "Cho Da Lat", distance: "1,2 km" },
      { label: "Ho Xuan Huong", distance: "1,6 km" },
      { label: "Vuon hoa thanh pho", distance: "2,1 km" },
      { label: "Ben xe Da Lat", distance: "2,4 km" },
    ],
    reviewTags: ["Duong di", "Khoang cach den trung tam", "Nhan vien than thien", "Gio nhan tra phong"],
    reviewExcerpt:
      "Khong gian yen tinh, phong sach va view dep. Vi tri thuan tien de di vao trung tam va cac diem tham quan.",
    description:
      "ECOTIME Villa Da Lat la diem dung chan phu hop cho nhom ban va gia dinh, voi khong gian sang sua, phong rong va dich vu on dinh. Khuon vien thoang, tam nhin mo va vi tri de di chuyen toi cac diem noi bat trong thanh pho.",
    rooms: [
      {
        id: "eco-deluxe-double",
        name: "Deluxe Double Garden View",
        size: "28 m2",
        guests: "2 nguoi lon",
        bed: "1 giuong doi",
        perks: ["Huy mien phi", "Khong can thanh toan truoc", "Bao gom an sang"],
        price: "469.405 VND",
      },
      {
        id: "eco-family-suite",
        name: "Family Suite Balcony",
        size: "42 m2",
        guests: "4 nguoi",
        bed: "2 giuong doi",
        perks: ["Ban cong rieng", "View thanh pho", "Bao gom an sang"],
        price: "890.000 VND",
      },
      {
        id: "eco-premier-king",
        name: "Premier King Room",
        size: "34 m2",
        guests: "3 nguoi",
        bed: "1 giuong king",
        perks: ["Phong tam rieng", "May lanh", "Cho o rong rai"],
        price: "690.000 VND",
      },
    ],
  },
  "elc-luxury-da-lat": {
    id: "elc-luxury-da-lat",
    name: "ELC Luxury Da Lat Hotel & Apartment",
    location: "Da Lat, Lam Dong",
    areaLabel: "Cach trung tam 0,7 km",
    rating: "8,6",
    reviews: "2.108 danh gia",
    price: "1.445.850 VND",
    oldPrice: "1.912.500 VND",
    propertyType: "Khach san",
    stars: 4,
    heroImages: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
    ],
    highlights: ["Gan trung tam", "Can ho rong", "Co cho dau xe"],
    amenities: ["May lanh", "WiFi", "Le tan 24h", "Cho dau xe", "Thang may", "Bep nho"],
    nearby: [
      { label: "Cho Da Lat", distance: "650 m" },
      { label: "Quang truong Lam Vien", distance: "1,1 km" },
      { label: "Ho Xuan Huong", distance: "1,2 km" },
      { label: "Ga Da Lat", distance: "2,0 km" },
    ],
    reviewTags: ["Trung tam", "Phong rong", "Sach se", "An sang on"],
    reviewExcerpt:
      "Vi tri rat de di bo ra trung tam. Phong moi, gon va nhan vien ho tro nhanh khi can.",
    description:
      "ELC Luxury Da Lat Hotel & Apartment phu hop cho khach can su thoai mai va khong gian rong hon thong thuong. Khu luu tru co phong cach hien dai, dich vu on dinh va kha gan cac diem trung tam.",
    rooms: [
      {
        id: "elc-studio",
        name: "Studio Apartment",
        size: "36 m2",
        guests: "2 nguoi lon",
        bed: "1 giuong queen",
        perks: ["Co bep nho", "Khong can thanh toan truoc", "Bao gom an sang"],
        price: "1.445.850 VND",
      },
      {
        id: "elc-premium-suite",
        name: "Premium Suite",
        size: "48 m2",
        guests: "4 nguoi",
        bed: "2 giuong doi",
        perks: ["Phong khach rieng", "Cho dau xe", "View pho"],
        price: "1.890.000 VND",
      },
      {
        id: "elc-deluxe-king",
        name: "Deluxe King Room",
        size: "30 m2",
        guests: "2 nguoi",
        bed: "1 giuong king",
        perks: ["May lanh", "Ban lam viec", "Le tan 24h"],
        price: "1.220.000 VND",
      },
    ],
  },
  "an-phu-home": {
    id: "an-phu-home",
    name: "AN PHU Home",
    location: "Da Lat, Lam Dong",
    areaLabel: "Cach trung tam 2,9 km",
    rating: "9,1",
    reviews: "284 danh gia",
    price: "792.000 VND",
    oldPrice: "900.000 VND",
    propertyType: "Can ho",
    stars: 3,
    heroImages: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    ],
    highlights: ["Canh nui dep", "Ban cong", "Phu hop gia dinh"],
    amenities: ["WiFi", "Bep", "Ban cong", "Phong khach", "May giat", "Cho dau xe"],
    nearby: [
      { label: "Doi Robin", distance: "1,4 km" },
      { label: "Cho dem Da Lat", distance: "2,7 km" },
      { label: "Ho Tuyen Lam", distance: "4,1 km" },
      { label: "Ben xe Da Lat", distance: "2,5 km" },
    ],
    reviewTags: ["Canh dep", "Yen tinh", "Phong rong", "Chu nha than thien"],
    reviewExcerpt:
      "Can ho gon gang, sach va co nhieu anh sang. O day thoai mai cho nhom nho va gia dinh.",
    description:
      "AN PHU Home mang phong cach can ho am cung voi khong gian song day du tien nghi. Noi day phu hop cho khach muon o dai hon, can su rieng tu va khong gian thoai mai nhu o nha.",
    rooms: [
      {
        id: "anphu-one-bedroom",
        name: "One Bedroom Apartment",
        size: "40 m2",
        guests: "3 nguoi",
        bed: "1 giuong king",
        perks: ["Phong khach rieng", "Bep day du", "Ban cong"],
        price: "792.000 VND",
      },
      {
        id: "anphu-family-home",
        name: "Family Home Stay",
        size: "60 m2",
        guests: "5 nguoi",
        bed: "2 giuong doi",
        perks: ["View nui", "May giat", "Co bep"],
        price: "1.150.000 VND",
      },
      {
        id: "anphu-studio",
        name: "Studio Cozy Room",
        size: "26 m2",
        guests: "2 nguoi",
        bed: "1 giuong doi",
        perks: ["WiFi mien phi", "Phong tam rieng", "Yen tinh"],
        price: "650.000 VND",
      },
    ],
  },
};

const buildGenericHotel = (hotelId: string): HotelDetail => {
  const title = hotelId
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return {
    id: hotelId,
    name: title,
    location: "Viet Nam",
    areaLabel: "Vi tri thuan tien",
    rating: "8,5",
    reviews: "120 danh gia",
    price: "990.000 VND",
    oldPrice: "1.190.000 VND",
    propertyType: "Khach san",
    stars: 4,
    heroImages: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=900&q=80",
    ],
    highlights: ["Vi tri dep", "WiFi mien phi", "Le tan 24h"],
    amenities: ["May lanh", "WiFi", "Le tan 24h", "Cho dau xe", "Thang may", "An sang"],
    nearby: [
      { label: "Trung tam thanh pho", distance: "1,2 km" },
      { label: "Ben xe", distance: "2,4 km" },
      { label: "San bay", distance: "8,6 km" },
    ],
    reviewTags: ["Sach se", "Tien nghi", "Nhan vien than thien", "Vi tri de di chuyen"],
    reviewExcerpt: "Phong gon gang, dich vu on va vi tri de di lai cho chuyen nghi ngan ngay.",
    description:
      "Day la trang chi tiet mau cho tung khach san trong danh sach ket qua. Giao dien uu tien trinh bay hinh anh, thong tin tong quan, phong trong va cac tien ich chinh.",
    rooms: [
      {
        id: `${hotelId}-standard`,
        name: "Standard Room",
        size: "24 m2",
        guests: "2 nguoi",
        bed: "1 giuong doi",
        perks: ["WiFi mien phi", "Khong can thanh toan truoc", "Phong tam rieng"],
        price: "990.000 VND",
      },
      {
        id: `${hotelId}-deluxe`,
        name: "Deluxe Room",
        size: "32 m2",
        guests: "3 nguoi",
        bed: "1 giuong king",
        perks: ["May lanh", "Cho o rong", "View dep"],
        price: "1.250.000 VND",
      },
    ],
  };
};

const normalizeHotelId = (hotelId: string) => hotelId.replace(/-display-\d+$/, "");

const getHotelDetail = (hotelId: string) => {
  const normalizedHotelId = normalizeHotelId(hotelId);
  return hotelDetails[normalizedHotelId] ?? buildGenericHotel(normalizedHotelId);
};

const parseVndPrice = (price: string) => Number.parseInt(price.replace(/[^\d]/g, ""), 10) || 0;

const formatVndPrice = (value: number) =>
  `${new Intl.NumberFormat("vi-VN").format(Math.max(0, Math.round(value)))} VND`;

const getGuestCount = (guestsLabel: string) => {
  const parsed = Number.parseInt(guestsLabel, 10);
  return Number.isFinite(parsed) ? Math.max(1, Math.min(parsed, 6)) : 1;
};

const getRoomBookingOptions = (room: RoomOption, index: number) => {
  const basePrice = parseVndPrice(room.price);

  return [
    {
      id: `${room.id}-standard`,
      title: `${room.name} - Gia linh hoat`,
      subtitle: "Khong can thanh toan truoc, ho tro doi lich neu con phong",
      guests: room.guests,
      price: room.price,
      oldPrice: formatVndPrice(basePrice + 180000),
      roomsLeft: index % 2 === 0 ? 1 : 2,
      badges: ["Mien phi huy phong trong 24 gio dau", room.perks[0] ?? "WiFi mien phi"],
    },
    {
      id: `${room.id}-breakfast`,
      title: `${room.name} - Kem an sang`,
      subtitle: "Bao gom an sang va uu tien nhan phong som khi kha dung",
      guests: room.guests,
      price: formatVndPrice(basePrice + 220000),
      oldPrice: formatVndPrice(basePrice + 360000),
      roomsLeft: 1,
      badges: ["Bao gom bua sang", room.perks[1] ?? "Khong can thanh toan truoc"],
    },
  ];
};

export default async function HotelDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ hotelId: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { hotelId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  if (!hotelId) notFound();

  const hotel = getHotelDetail(hotelId);
  const destinationParam = resolvedSearchParams?.destination;
  const checkInParam = resolvedSearchParams?.checkIn;
  const checkOutParam = resolvedSearchParams?.checkOut;
  const adultsParam = resolvedSearchParams?.adults;
  const childrenParam = resolvedSearchParams?.children;
  const roomsParam = resolvedSearchParams?.rooms;
  const bedsParam = resolvedSearchParams?.beds;

  const readParam = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] ?? "" : value ?? "";

  const readNumberParam = (value: string | string[] | undefined, fallback: number) => {
    const raw = readParam(value);
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  return (
    <main className="min-h-screen bg-[#edf3f8] text-slate-900">
      <SharedSearchShell
        submitPath="/booking/results"
        initialDestination={readParam(destinationParam) || hotel.location}
        initialCheckIn={readParam(checkInParam)}
        initialCheckOut={readParam(checkOutParam)}
        initialAdults={readNumberParam(adultsParam, 2)}
        initialChildren={readNumberParam(childrenParam, 0)}
        initialRooms={readNumberParam(roomsParam, 1)}
        initialBeds={readNumberParam(bedsParam, 1)}
        showFilterButton={false}
        submitLabel="Tim khach san"
        bottomContent={<HotelDetailTabs />}
      />

      <div className="mx-auto w-full max-w-7xl px-4 pb-14 pt-6 lg:px-8">
        <HotelImageGallery images={hotel.heroImages} hotelName={hotel.name} />

        <section className="mt-6 overflow-hidden rounded-[28px] border border-[#d8e5ef] bg-white shadow-[0_16px_34px_rgba(31,62,83,0.08)]">
          <div className="space-y-8 p-5 lg:p-8">
            <section id="overview">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h1 className="text-[2.1rem] font-extrabold leading-tight text-[#0b2752]">{hotel.name}</h1>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-[#e8f4ff] px-3 py-1 text-sm font-semibold text-[#0d63c8]">
                      {hotel.propertyType}
                    </span>
                    <div className="flex items-center gap-1 text-[#f5b400]">
                      {Array.from({ length: hotel.stars }).map((_, index) => (
                        <Star key={`${hotel.id}-star-${index}`} className="size-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm text-slate-500">Gia/phong/dem tu</p>
                  <div className="mt-1 flex items-baseline justify-end gap-3">
                    <span className="text-sm text-slate-400 line-through">{hotel.oldPrice}</span>
                    <span className="text-[2rem] font-extrabold leading-none text-[#ff671f]">{hotel.price}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr]">
                <article className="rounded-[24px] border border-[#dbe8f1] bg-[linear-gradient(135deg,#ffffff_0%,#f7fbff_48%,#eef7ff_100%)] p-5">
                  <div className="flex items-center gap-4">
                    <div className="text-[2rem] font-extrabold text-[#0b63c8]">
                      {hotel.rating}
                      <span className="text-base text-slate-500">/10</span>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-slate-900">Rat tot</p>
                      <p className="font-semibold text-[#0b63c8]">{hotel.reviews}</p>
                    </div>
                  </div>
                  <h2 className="mt-4 text-[1.45rem] font-bold text-slate-900">Khach noi gi ve ky nghi cua ho</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {hotel.reviewTags.map((tag) => (
                      <span key={tag} className="rounded-full bg-[#dcf9f0] px-3 py-1 text-sm font-medium text-[#11895c]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="mt-5 leading-7 text-slate-700">{hotel.reviewExcerpt}</p>
                </article>

                <article id="location" className="rounded-[24px] border border-[#dbe8f1] bg-white p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-[1.45rem] font-bold text-slate-900">Trong khu vuc</h2>
                    <a href="#map" className="inline-flex items-center gap-1 font-semibold text-[#0b63c8]">
                      <span>Xem ban do</span>
                      <ChevronRight className="size-4" />
                    </a>
                  </div>
                  <p className="text-lg font-medium leading-8 text-slate-800">{hotel.location}</p>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#eef7ff] px-3 py-1 text-sm font-semibold text-[#0b63c8]">
                    <MapPin className="size-4" />
                    <span>{hotel.areaLabel}</span>
                  </div>
                  <div className="mt-5 space-y-3">
                    {hotel.nearby.map((item) => (
                      <div key={item.label} className="flex items-start justify-between gap-4 text-[1.02rem]">
                        <span className="font-medium text-slate-800">{item.label}</span>
                        <span className="shrink-0 text-slate-500">{item.distance}</span>
                      </div>
                    ))}
                  </div>
                </article>

                <article id="amenities" className="rounded-[24px] border border-[#dbe8f1] bg-white p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-[1.45rem] font-bold text-slate-900">Tien ich chinh</h2>
                    <a href="#amenities-full" className="inline-flex items-center gap-1 font-semibold text-[#0b63c8]">
                      <span>Xem them</span>
                      <ChevronRight className="size-4" />
                    </a>
                  </div>
                  <div className="grid grid-cols-1 gap-4 text-[1.02rem] font-medium text-slate-800 sm:grid-cols-2">
                    {hotel.amenities.slice(0, 6).map((amenity, index) => (
                      <div key={amenity} className="inline-flex items-center gap-3">
                        {index % 3 === 0 ? <Sparkles className="size-5 text-[#1494e6]" /> : null}
                        {index % 3 === 1 ? <Wifi className="size-5 text-[#1494e6]" /> : null}
                        {index % 3 === 2 ? <ShieldCheck className="size-5 text-[#1494e6]" /> : null}
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </article>
              </div>

              <article className="mt-4 rounded-[24px] border border-[#dbe8f1] bg-white p-5">
                <p className="text-lg leading-8 text-slate-800">{hotel.description}</p>
                <a href="#policy" className="mt-4 inline-flex items-center gap-1 font-semibold text-[#0b63c8]">
                  <span>Xem them</span>
                  <ChevronRight className="size-4" />
                </a>
              </article>
            </section>

            <section id="rooms" className="scroll-mt-40">
              <div className="rounded-[26px] border border-[#d6e4f0] bg-[#f7fbff] p-4 lg:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-[1.8rem] font-extrabold text-[#0b2752]">Nhung phong con trong tai {hotel.name}</h2>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#eef7ff] px-4 py-2 text-sm font-semibold text-[#0b63c8]">
                    <Clock3 className="size-4" />
                    <span>Thoi gian: 1 dem</span>
                  </div>
                </div>

                <div className="mt-4 rounded-[18px] bg-[#2f63a7] px-4 py-3 text-sm font-semibold text-white">
                  <div className="inline-flex items-center gap-2">
                    <ShieldCheck className="size-4" />
                    <span>Phi dat phong trong thai diem thong tin chi nhan khi huy phong o thoi hy miem phi</span>
                  </div>
                </div>

                <div className="mt-4 rounded-[20px] border border-[#d7e5f1] bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-medium text-slate-600">Tim kiem nhanh hon bang cach chon nhung tien nghi ban can</p>
                    <div className="rounded-xl border border-[#d7e5f1] bg-[#f8fbfe] px-3 py-2 text-sm font-medium text-slate-600">
                      Hien thi gia moi phong moi dem
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Mien phi huy phong", "Thanh toan tai khach san", "Extra benefit", "Mien phi bua sang"].map((item) => (
                      <span key={item} className="rounded-full border border-[#d6e7f2] bg-[#f5fbff] px-3 py-1 text-xs font-semibold text-[#2d79b8]">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 space-y-5">
                  {hotel.rooms.map((room, index) => {
                    const bookingOptions = getRoomBookingOptions(room, index);

                    return (
                      <article key={room.id} className="overflow-hidden rounded-[22px] border border-[#d7e5f0] bg-white shadow-sm">
                        <div className="border-b border-[#dfeaf3] bg-[#f8fbfe] px-4 py-3">
                          <h3 className="text-lg font-bold text-[#183b67]">{room.name}</h3>
                        </div>

                        <div className="grid lg:grid-cols-[280px_minmax(0,1fr)]">
                          <div className="border-b border-[#e2edf5] p-4 lg:border-b-0 lg:border-r">
                            <img
                              src={hotel.heroImages[(index + 1) % hotel.heroImages.length]}
                              alt={room.name}
                              className="h-[200px] w-full rounded-[18px] object-cover"
                            />

                            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
                              <div className="inline-flex items-center gap-2">
                                <Maximize2 className="size-4 text-[#1494e6]" />
                                <span>{room.size}</span>
                              </div>
                              <div className="inline-flex items-center gap-2">
                                <BedDouble className="size-4 text-[#1494e6]" />
                                <span>{room.bed}</span>
                              </div>
                              <div className="inline-flex items-center gap-2">
                                <Users className="size-4 text-[#1494e6]" />
                                <span>{room.guests}</span>
                              </div>
                              <div className="inline-flex items-center gap-2">
                                <Bath className="size-4 text-[#1494e6]" />
                                <span>Phong tam rieng</span>
                              </div>
                              <div className="inline-flex items-center gap-2">
                                <Wifi className="size-4 text-[#1494e6]" />
                                <span>WiFi toc do cao</span>
                              </div>
                              <div className="inline-flex items-center gap-2">
                                <Coffee className="size-4 text-[#1494e6]" />
                                <span>Nuoc uong chao mung</span>
                              </div>
                            </div>

                            <a href="#overview" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#0b63c8]">
                              <span>Xem chi tiet phong</span>
                              <ChevronRight className="size-4" />
                            </a>
                          </div>

                          <div className="overflow-hidden">
                            <div className="grid grid-cols-[minmax(0,1.7fr)_90px_140px_90px_110px] border-b border-[#dfeaf3] bg-[#f4f8fc] text-xs font-semibold uppercase tracking-[0.02em] text-slate-500">
                              <div className="px-4 py-3">Lua chon phong</div>
                              <div className="px-3 py-3 text-center">Khach</div>
                              <div className="px-3 py-3 text-center">Gia/phong/dem</div>
                              <div className="px-3 py-3 text-center">Phong</div>
                              <div className="px-3 py-3 text-center">Dat</div>
                            </div>

                            {bookingOptions.map((option, optionIndex) => (
                              <div
                                key={option.id}
                                className={`grid grid-cols-[minmax(0,1.7fr)_90px_140px_90px_110px] ${
                                  optionIndex !== bookingOptions.length - 1 ? "border-b border-[#e2edf5]" : ""
                                }`}
                              >
                                <div className="px-4 py-4">
                                  <p className="text-sm font-semibold text-slate-900">{option.title}</p>
                                  <p className="mt-1 text-sm text-slate-500">{option.subtitle}</p>
                                  <div className="mt-3 space-y-2">
                                    {option.badges.map((badge) => (
                                      <div key={badge} className="inline-flex items-center gap-2 text-sm text-[#17914f]">
                                        <Check className="size-4" />
                                        <span>{badge}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex items-start justify-center px-3 py-4">
                                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                                    {Array.from({ length: getGuestCount(option.guests) }).map((_, guestIndex) => (
                                      <Users
                                        key={`${option.id}-guest-${guestIndex}`}
                                        className="size-4 text-slate-700"
                                      />
                                    ))}
                                  </div>
                                </div>

                                <div className="px-3 py-4 text-center">
                                  <p className="text-xs text-slate-400 line-through">{option.oldPrice}</p>
                                  <p className="mt-1 text-lg font-extrabold text-[#ff671f]">{option.price}</p>
                                  <p className="mt-1 text-[11px] text-slate-500">Bao gom thue va phi</p>
                                </div>

                                <div className="flex flex-col items-center justify-center px-3 py-4">
                                  <span className="text-sm font-semibold text-slate-700">x{option.roomsLeft}</span>
                                  <span className="mt-2 text-[11px] font-semibold text-[#f25555]">Chi con {option.roomsLeft} phong</span>
                                </div>

                                <div className="flex items-center justify-center px-3 py-4">
                                  <button
                                    type="button"
                                    className="inline-flex h-10 items-center justify-center rounded-xl bg-[#0b84ff] px-4 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(11,132,255,0.22)] transition hover:bg-[#0977e4]"
                                  >
                                    Chon
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>

            <section id="policy" className="scroll-mt-40 rounded-[24px] border border-[#dbe8f1] bg-white p-6">
              <h2 className="text-[1.55rem] font-bold text-slate-900">Chinh sach luu tru</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="rounded-[18px] bg-[#f7fbff] p-4">
                  <p className="font-semibold text-slate-900">Nhan phong</p>
                  <p className="mt-2 text-slate-600">Tu 14:00. Ho tro nhan som tuy tinh trang phong.</p>
                </div>
                <div className="rounded-[18px] bg-[#f7fbff] p-4">
                  <p className="font-semibold text-slate-900">Tra phong</p>
                  <p className="mt-2 text-slate-600">Truoc 12:00. Co the tra muon neu dang ky truoc.</p>
                </div>
                <div className="rounded-[18px] bg-[#f7fbff] p-4">
                  <p className="font-semibold text-slate-900">Thanh toan</p>
                  <p className="mt-2 text-slate-600">Ho tro dat phong linh hoat, hoa don va xac nhan nhanh.</p>
                </div>
              </div>
            </section>

            <section id="reviews" className="scroll-mt-40 rounded-[24px] border border-[#dbe8f1] bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-[1.55rem] font-bold text-slate-900">Danh gia gan day</h2>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#eef7ff] px-4 py-2 font-semibold text-[#0b63c8]">
                  <Star className="size-4 fill-current" />
                  <span>
                    {hotel.rating}/10 - {hotel.reviews}
                  </span>
                </span>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <article className="rounded-[18px] border border-slate-200 p-4">
                  <p className="font-semibold text-slate-900">Khach doi</p>
                  <p className="mt-3 leading-7 text-slate-700">
                    Vi tri de di lai, phong sach va nhan vien lich su. Quy trinh nhan phong gon va gia hop ly.
                  </p>
                </article>
                <article className="rounded-[18px] border border-slate-200 p-4">
                  <p className="font-semibold text-slate-900">Khach gia dinh</p>
                  <p className="mt-3 leading-7 text-slate-700">
                    Khong gian thoang, cac tien ich du dung va thong tin phong ro rang. Phu hop cho ky nghi ngan ngay.
                  </p>
                </article>
              </div>
            </section>

            <section id="map" className="scroll-mt-40 rounded-[24px] border border-[#dbe8f1] bg-[linear-gradient(135deg,#dff1ff_0%,#edf7ff_45%,#ffffff_100%)] p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-[1.55rem] font-bold text-slate-900">Vi tri va di chuyen</h2>
                  <p className="mt-2 text-slate-600">{hotel.location}</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-semibold text-[#0b63c8] shadow-sm">
                  <Plane className="size-4" />
                  <span>Gan san bay va trung tam</span>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
