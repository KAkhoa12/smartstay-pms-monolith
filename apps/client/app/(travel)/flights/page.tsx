import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Dot,
  MapPin,
  Plane,
  Search,
  Users,
} from "lucide-react";

const nearbySearches = [
  {
    from: "SGN San bay Quoc te Tan Son Nhat",
    to: "BKK San bay Suvarnabhumi",
    meta: "2 thang 5 - 9 thang 5 • 1 hanh khach, khu hoi",
  },
];

const countryHighlights = [
  {
    name: "Viet Nam",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Thai Lan",
    image:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Indonesia",
    image:
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=900&q=80",
  },
];

const popularFlights = [
  {
    route: "TP. Ho Chi Minh den Bangkok",
    info: "1 thang 4 - 8 thang 4 • Khu hoi",
    image:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=900&q=80",
  },
  {
    route: "TP. Ho Chi Minh den Kuta",
    info: "31 thang 3 - 10 thang 4 • Khu hoi",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80",
  },
  {
    route: "TP. Ho Chi Minh den Singapore",
    info: "7 thang 4 - 9 thang 4 • Khu hoi",
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=900&q=80",
  },
  {
    route: "TP. Ho Chi Minh den Siem Reap",
    info: "3 thang 4 - 8 thang 4 • Khu hoi",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80",
  },
];

export default function FlightsPage() {
  return (
    <main className="min-h-screen bg-[#f6f8fc] text-slate-900">
      <section className="bg-[linear-gradient(180deg,#0b4fb7_0%,#0a46a1_100%)] pb-10 pt-6">
        <div className="mx-auto w-full max-w-6xl px-4 lg:px-8">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl font-extrabold leading-tight">So sanh va dat ve may bay de dang</h1>
            <p className="mt-2 text-sm font-medium text-white/90">Kham pha diem den trong mo tiep theo</p>
          </div>

          <div className="mt-5 rounded-[22px] border border-[#f9c34b] bg-white p-4 shadow-[0_18px_36px_rgba(7,36,89,0.18)]">
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="tripType" defaultChecked className="accent-[#0b63c8]" />
                <span>Khu hoi</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="tripType" className="accent-[#0b63c8]" />
                <span>Mot chieu</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="tripType" className="accent-[#0b63c8]" />
                <span>Nhieu chang</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" className="accent-[#0b63c8]" />
                <span>Hang pho thong</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" className="accent-[#0b63c8]" />
                <span>Chi tim chuyen bay thang</span>
              </label>
            </div>

            <div className="mt-4 grid gap-2 lg:grid-cols-[1.2fr_auto_1.2fr_1fr_1fr_auto]">
              <button className="flex h-12 items-center gap-3 rounded-xl border border-[#d7e6ef] px-4 text-left">
                <MapPin className="size-4 text-[#0b63c8]" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.08em] text-slate-400">Bay tu</p>
                  <p className="text-sm font-semibold text-slate-800">SGN San bay Quoc te Tan Son Nhat</p>
                </div>
              </button>

              <div className="hidden items-center justify-center lg:flex">
                <ArrowRight className="size-5 text-[#0b63c8]" />
              </div>

              <button className="flex h-12 items-center gap-3 rounded-xl border border-[#d7e6ef] px-4 text-left">
                <Plane className="size-4 text-[#0b63c8]" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.08em] text-slate-400">Bay den</p>
                  <p className="text-sm font-semibold text-slate-800">BKK Bangkok</p>
                </div>
              </button>

              <button className="flex h-12 items-center gap-3 rounded-xl border border-[#d7e6ef] px-4 text-left">
                <CalendarDays className="size-4 text-[#0b63c8]" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.08em] text-slate-400">Ngay bay</p>
                  <p className="text-sm font-semibold text-slate-800">17 thang 5 - 19 thang 5</p>
                </div>
              </button>

              <button className="flex h-12 items-center gap-3 rounded-xl border border-[#d7e6ef] px-4 text-left">
                <Users className="size-4 text-[#0b63c8]" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.08em] text-slate-400">Hanh khach</p>
                  <p className="text-sm font-semibold text-slate-800">1 nguoi lon</p>
                </div>
              </button>

              <button className="inline-flex h-12 items-center justify-center rounded-xl bg-[#0b63c8] px-6 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(11,99,200,0.24)] transition hover:bg-[#0957b1]">
                <Search className="mr-2 size-4" />
                Kham pha
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-[#ff9a3d] bg-white px-4 py-3 text-sm leading-6 text-slate-600 shadow-[0_10px_20px_rgba(7,36,89,0.08)]">
            <p className="font-semibold text-slate-800">Thong tin cap nhat quan trong ve chuyen di</p>
            <p className="mt-1">
              Do xu huong thay doi lich bay, vui long kiem tra thong tin hang hang khong va dieu kien di lai moi nhat
              truoc khi dat ve.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto w-full max-w-6xl px-4 lg:px-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Tiep tuc tim kiem</h2>
            <div className="mt-4 flex flex-wrap gap-4">
              {nearbySearches.map((item) => (
                <article
                  key={item.from}
                  className="flex max-w-sm gap-3 rounded-2xl border border-[#dce8f1] bg-white p-3 shadow-[0_10px_22px_rgba(31,62,83,0.08)]"
                >
                  <div className="grid h-14 w-14 place-items-center rounded-xl bg-[#eaf4ff] text-[#0b63c8]">
                    <Plane className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{item.from}</p>
                    <p className="mt-1 text-sm text-slate-700">{item.to}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.meta}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Kham pha theo quoc gia</h2>
                <p className="mt-1 text-sm text-slate-500">Kham pha cac diem den thinh hanh, de dang bay den</p>
              </div>
              <button className="inline-flex size-10 items-center justify-center rounded-full border border-[#d5e3ee] bg-white text-[#0b63c8] shadow-sm">
                <ChevronRight className="size-4" />
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-4">
              {countryHighlights.map((item) => (
                <article
                  key={item.name}
                  className="overflow-hidden rounded-[24px] border border-[#dce7f0] bg-white shadow-[0_12px_26px_rgba(31,62,83,0.08)]"
                >
                  <img src={item.image} alt={item.name} className="h-52 w-full object-cover" />
                  <div className="px-4 py-3">
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <Dot className="size-6 text-[#ff5b5b]" />
                      <span>{item.name}</span>
                    </p>
                  </div>
                </article>
              ))}

              <article className="flex min-h-[260px] flex-col items-start justify-end rounded-[24px] bg-[linear-gradient(160deg,#0b4fb7_0%,#0a3f94_100%)] p-5 text-white shadow-[0_16px_28px_rgba(12,52,122,0.24)]">
                <div className="grid size-12 place-items-center rounded-2xl bg-white/15">
                  <Plane className="size-6" />
                </div>
                <h3 className="mt-16 text-xl font-bold">Bat cu noi dau</h3>
                <p className="mt-2 text-sm text-white/85">Kham pha tat ca diem den</p>
              </article>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold text-slate-900">Chuyen bay pho bien gan ban</h2>
            <p className="mt-1 text-sm text-slate-500">Tim uu dai chuyen bay trong nuoc va quoc te</p>

            <div className="mt-2 flex gap-5 text-xs font-semibold text-[#0b63c8]">
              <button className="border-b-2 border-[#0b63c8] pb-2">Quoc te</button>
              <button className="pb-2 text-slate-400">Trong nuoc</button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-4">
              {popularFlights.map((item) => (
                <article
                  key={item.route}
                  className="overflow-hidden rounded-[22px] border border-[#dce7f0] bg-white shadow-[0_12px_24px_rgba(31,62,83,0.08)]"
                >
                  <img src={item.image} alt={item.route} className="h-36 w-full object-cover" />
                  <div className="p-4">
                    <p className="text-sm font-semibold leading-6 text-slate-900">{item.route}</p>
                    <p className="mt-2 text-xs text-slate-500">{item.info}</p>
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
