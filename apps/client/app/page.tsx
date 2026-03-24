import Link from "next/link";

export default function Home() {
  const features = [
    {
      title: "Quan ly dat phong tap trung",
      description:
        "Theo doi tinh trang phong theo thoi gian thuc, tranh overbooking va xu ly booking nhanh trong mot man hinh.",
    },
    {
      title: "Le tan thong minh",
      description:
        "Check-in, check-out, gia han luu tru va thu phi phat sinh chi voi vai thao tac, giam thoi gian cho tai quay.",
    },
    {
      title: "Dieu phoi Housekeeping",
      description:
        "Tu dong phan viec don phong theo trang thai phong, giup doi ngu van hanh chinh xac va dung uu tien.",
    },
    {
      title: "Bao cao doanh thu tuc thi",
      description:
        "Xem cong suat phong, ADR, RevPAR va doanh thu theo ngay/tuan/thang de ra quyet dinh kip thoi.",
    },
    {
      title: "Ho tro da chi nhanh",
      description:
        "Quan tri nhieu khach san trong cung mot he thong voi phan quyen ro rang theo vai tro va co so.",
    },
    {
      title: "Tu dong hoa quy trinh",
      description:
        "Giam thao tac thu cong bang quy tac tu dong cho xac nhan dat phong, nhac thanh toan va bao cao dinh ky.",
    },
  ];

  const plans = [
    {
      name: "Starter",
      price: "1.290.000d",
      period: "/thang",
      description: "Phu hop khach san nho moi chuyen doi so.",
      highlights: ["Toi da 30 phong", "Quan ly le tan co ban", "Bao cao van hanh tieu chuan"],
      featured: false,
    },
    {
      name: "Growth",
      price: "2.990.000d",
      period: "/thang",
      description: "Danh cho khach san muon tang truong nhanh.",
      highlights: ["Toi da 120 phong", "Housekeeping nang cao", "Dashboard doanh thu theo thoi gian thuc"],
      featured: true,
    },
    {
      name: "Enterprise",
      price: "Lien he",
      period: "",
      description: "Cho chuoi khach san can tuy bien sau.",
      highlights: ["Da chi nhanh khong gioi han", "Phan quyen nang cao", "Tu van trien khai rieng"],
      featured: false,
    },
  ];

  const faqs = [
    {
      question: "Mat bao lau de trien khai SmartStay PMS?",
      answer:
        "Thong thuong tu 3-7 ngay lam viec, tuy quy mo khach san va nhu cau cau hinh quy trinh van hanh.",
    },
    {
      question: "Doi ngu le tan co can biet ky thuat khong?",
      answer:
        "Khong can. Giao dien duoc thiet ke cho van hanh thuc te nen nhan su moi co the lam quen nhanh sau 1 buoi huong dan.",
    },
    {
      question: "SmartStay co ho tro nhieu co so khong?",
      answer:
        "Co. Ban co the quan ly nhieu khach san trong cung tai khoan va theo doi so lieu tung co so hoac toan chuoi.",
    },
    {
      question: "Co the dung thu truoc khi mua khong?",
      answer:
        "Co. Ban co the dang ky dung thu mien phi de trai nghiem quy trinh dat phong, check-in/check-out va bao cao.",
    },
  ];

  return (
    <div className="page-background text-slate-900">
      <header className="sticky top-0 z-50 border-b border-white/70 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 md:px-8">
          <Link href="/" className="text-lg font-semibold tracking-tight text-[var(--brand-deep)]">
            SmartStay PMS
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-700 md:flex">
            <a href="#features" className="transition-colors hover:text-[var(--brand-deep)]">
              Tinh nang
            </a>
            <a href="#pricing" className="transition-colors hover:text-[var(--brand-deep)]">
              Bang gia
            </a>
            <a href="#faq" className="transition-colors hover:text-[var(--brand-deep)]">
              FAQ
            </a>
            <a href="#contact" className="transition-colors hover:text-[var(--brand-deep)]">
              Lien he
            </a>
          </nav>
          <a
            href="#contact"
            className="rounded-full bg-[var(--brand-deep)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--brand-teal)]"
          >
            Dat lich demo
          </a>
        </div>
      </header>

      <main>
        <section className="mx-auto grid w-full max-w-6xl gap-12 px-5 pb-16 pt-14 md:grid-cols-2 md:items-center md:px-8 md:pt-20">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-[var(--brand-teal)]/30 bg-[var(--brand-teal)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--brand-deep)]">
              Nen tang quan ly khach san the he moi
            </p>
            <h1 className="text-balance text-4xl font-semibold leading-tight text-[var(--brand-deep)] md:text-5xl">
              Tang cong suat phong, giam thao tac van hanh voi SmartStay PMS
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
              Tu dat phong, le tan den bao cao doanh thu, moi quy trinh duoc ket noi tren mot nen tang truc quan de doi
              ngu van hanh nhanh va chinh xac hon moi ngay.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#contact"
                className="rounded-full bg-[var(--brand-deep)] px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Dung thu mien phi
              </a>
              <a
                href="#pricing"
                className="rounded-full border border-[var(--brand-deep)]/20 bg-white px-6 py-3 text-center text-sm font-semibold text-[var(--brand-deep)] transition hover:border-[var(--brand-teal)]/50 hover:text-[var(--brand-teal)]"
              >
                Xem bang gia
              </a>
            </div>
          </div>

          <div className="surface-card relative overflow-hidden rounded-3xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">Tong quan van hanh hom nay</p>
              <span className="rounded-full bg-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-800">
                +12.4%
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Cong suat phong</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">82%</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Dat phong moi</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">37</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Doanh thu hom nay</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">48.6M</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Phong can don</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">14</p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-3xl font-semibold text-[var(--brand-deep)]">Tinh nang giup khach san van hanh muot ma</h2>
            <p className="mt-3 text-slate-600">
              Bo cong cu duoc thiet ke tu bai toan thuc te tai quay le tan va bo phan van hanh.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="surface-card rounded-2xl p-5">
                <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="pricing" className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-semibold text-[var(--brand-deep)]">Bang gia linh hoat theo quy mo</h2>
            <p className="mt-3 text-slate-600">Chon goi phu hop voi giai doan tang truong cua khach san.</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`rounded-3xl border p-6 ${
                  plan.featured
                    ? "border-[var(--brand-teal)] bg-[var(--brand-teal)]/5 shadow-[var(--shadow-brand)]"
                    : "border-slate-200 bg-white shadow-sm"
                }`}
              >
                {plan.featured ? (
                  <p className="mb-4 inline-flex rounded-full bg-[var(--brand-teal)] px-3 py-1 text-xs font-semibold text-white">
                    Khuyen nghi
                  </p>
                ) : null}
                <h3 className="text-xl font-semibold text-slate-900">{plan.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{plan.description}</p>
                <p className="mt-5 text-3xl font-semibold text-[var(--brand-deep)]">
                  {plan.price}
                  <span className="ml-1 text-base font-medium text-slate-500">{plan.period}</span>
                </p>
                <ul className="mt-5 space-y-2 text-sm text-slate-700">
                  {plan.highlights.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`mt-6 inline-flex w-full justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                    plan.featured
                      ? "bg-[var(--brand-deep)] text-white hover:bg-zinc-800"
                      : "border border-slate-300 text-slate-800 hover:border-[var(--brand-teal)] hover:text-[var(--brand-teal)]"
                  }`}
                >
                  Dang ky tu van
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="faq" className="mx-auto w-full max-w-4xl px-5 py-16 md:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-semibold text-[var(--brand-deep)]">Cau hoi thuong gap</h2>
            <p className="mt-3 text-slate-600">Mot vai thong tin nhanh truoc khi ban bat dau dung thu.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((item) => (
              <details key={item.question} className="surface-card rounded-2xl p-5">
                <summary className="cursor-pointer list-none pr-6 text-base font-semibold text-slate-900">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="contact" className="mx-auto w-full max-w-6xl px-5 pb-16 pt-10 md:px-8">
          <div className="rounded-3xl bg-[linear-gradient(120deg,var(--brand-deep),var(--brand-teal))] px-6 py-10 text-white md:px-10">
            <h2 className="text-3xl font-semibold">San sang nang cap van hanh khach san?</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90 md:text-base">
              Dat lich demo 30 phut de doi ngu SmartStay tu van quy trinh phu hop voi mo hinh khach san cua ban.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="mailto:sales@smartstay.vn"
                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[var(--brand-deep)] transition hover:bg-slate-100"
              >
                sales@smartstay.vn
              </a>
              <a
                href="tel:+842812345678"
                className="rounded-full border border-white/50 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Hotline: (028) 1234 5678
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/80 px-5 py-8 text-center text-sm text-slate-500 md:px-8">
        Copyright {new Date().getFullYear()} SmartStay PMS. All rights reserved.
      </footer>
    </div>
  );
}
