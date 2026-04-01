"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [taxCode, setTaxCode] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Vietnam");
  const [companySize, setCompanySize] = useState("");
  const [hotelCount, setHotelCount] = useState("1");
  const [domain, setDomain] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedFullName || !trimmedEmail || !companyName.trim() || !password || !confirmPassword) {
      setSuccessMessage("");
      setErrorMessage("Vui long nhap day du thong tin.");
      return;
    }

    if (password !== confirmPassword) {
      setSuccessMessage("");
      setErrorMessage("Mat khau xac nhan khong khop.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: trimmedFullName,
          email: trimmedEmail,
          companyName: companyName.trim(),
          legalName: legalName.trim(),
          businessType: businessType.trim(),
          taxCode: taxCode.trim(),
          phoneNumber: phoneNumber.trim(),
          jobTitle: jobTitle.trim(),
          websiteUrl: websiteUrl.trim(),
          addressLine: addressLine.trim(),
          city: city.trim(),
          country: country.trim(),
          companySize: companySize.trim(),
          hotelCount: Number(hotelCount) || 1,
          domain: domain.trim(),
          password,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | {
            success?: boolean;
            message?: string;
            payload?: unknown;
          }
        | null;

      if (!response.ok || !data?.success) {
        setErrorMessage(data?.message ?? "Dang ky that bai.");
        return;
      }

      setSuccessMessage("Dang ky thanh cong. Dang chuyen ban den trang dang nhap...");
      setFullName("");
      setJobTitle("");
      setPhoneNumber("");
      setEmail("");
      setCompanyName("");
      setLegalName("");
      setBusinessType("");
      setTaxCode("");
      setWebsiteUrl("");
      setAddressLine("");
      setCity("");
      setCountry("Vietnam");
      setCompanySize("");
      setHotelCount("1");
      setDomain("");
      setPassword("");
      setConfirmPassword("");

      window.setTimeout(() => {
        router.push(`/login?registered=1&email=${encodeURIComponent(trimmedEmail)}`);
      }, 900);
    } catch {
      setErrorMessage("Khong the tao tai khoan luc nay. Vui long thu lai.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="text-center text-[2.1rem] font-bold leading-tight text-slate-900">Dang ky</h1>
      <p className="mt-5 max-w-[520px] text-[1.05rem] leading-8 text-slate-800">
        Tao tai khoan SmartStay de bat dau su dung cac cong cu quan ly va dich vu cho luu tru.
      </p>

      <form className="mt-7" onSubmit={handleSubmit}>
        {errorMessage ? (
          <div className="mb-4 rounded-[8px] border border-[#f1b7b7] bg-[#fff1f1] px-4 py-3 text-sm text-[#b42318]">
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div className="mb-4 rounded-[8px] border border-[#9fd7ab] bg-[#effaf2] px-4 py-3 text-sm text-[#18794e]">
            {successMessage}
          </div>
        ) : null}

        <div>
          <label htmlFor="fullNameInput" className="mb-2 block text-[1.1rem] font-semibold text-slate-900">
            Ho va ten
          </label>
          <input
            id="fullNameInput"
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Nhap ho va ten cua ban"
            className="h-13 w-full rounded-[8px] border-2 border-[#8fcad9] bg-white px-4 text-[1.03rem] text-slate-900 outline-none transition shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
          />
        </div>

        <div className="mt-5">
          <label htmlFor="jobTitleInput" className="mb-2 block text-[1.1rem] font-semibold text-slate-900">
            Chuc vu
          </label>
          <input
            id="jobTitleInput"
            type="text"
            value={jobTitle}
            onChange={(event) => setJobTitle(event.target.value)}
            placeholder="Vi du: Giam doc van hanh"
            className="h-13 w-full rounded-[8px] border-2 border-[#8fcad9] bg-white px-4 text-[1.03rem] text-slate-900 outline-none transition shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
          />
        </div>

        <div className="mt-5">
          <label htmlFor="phoneNumberInput" className="mb-2 block text-[1.1rem] font-semibold text-slate-900">
            So dien thoai lien he
          </label>
          <input
            id="phoneNumberInput"
            type="tel"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            placeholder="Nhap so dien thoai doanh nghiep"
            className="h-13 w-full rounded-[8px] border-2 border-[#8fcad9] bg-white px-4 text-[1.03rem] text-slate-900 outline-none transition shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
          />
        </div>

        <div className="mt-5">
          <label htmlFor="registerInput" className="mb-2 block text-[1.1rem] font-semibold text-slate-900">
            Dia chi email
          </label>
          <input
            id="registerInput"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Nhap dia chi email cua ban"
            className="h-13 w-full rounded-[8px] border-2 border-[#8fcad9] bg-white px-4 text-[1.03rem] text-slate-900 outline-none transition shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
          />
        </div>

        <div className="mt-5">
          <label htmlFor="companyNameInput" className="mb-2 block text-[1.1rem] font-semibold text-slate-900">
            Ten doanh nghiep
          </label>
          <input
            id="companyNameInput"
            type="text"
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            placeholder="Nhap ten thuong mai doanh nghiep"
            className="h-13 w-full rounded-[8px] border-2 border-[#8fcad9] bg-white px-4 text-[1.03rem] text-slate-900 outline-none transition shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
          />
        </div>

        <div className="mt-5">
          <label htmlFor="legalNameInput" className="mb-2 block text-[1.1rem] font-semibold text-slate-900">
            Ten phap ly
          </label>
          <input
            id="legalNameInput"
            type="text"
            value={legalName}
            onChange={(event) => setLegalName(event.target.value)}
            placeholder="Nhap ten phap ly neu co"
            className="h-13 w-full rounded-[8px] border-2 border-[#8fcad9] bg-white px-4 text-[1.03rem] text-slate-900 outline-none transition shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
          />
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="businessTypeInput" className="mb-2 block text-[1.1rem] font-semibold text-slate-900">
              Linh vuc kinh doanh
            </label>
            <input
              id="businessTypeInput"
              type="text"
              value={businessType}
              onChange={(event) => setBusinessType(event.target.value)}
              placeholder="Vi du: Hospitality"
              className="h-13 w-full rounded-[8px] border-2 border-[#8fcad9] bg-white px-4 text-[1.03rem] text-slate-900 outline-none transition shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
            />
          </div>
          <div>
            <label htmlFor="taxCodeInput" className="mb-2 block text-[1.1rem] font-semibold text-slate-900">
              Ma so thue
            </label>
            <input
              id="taxCodeInput"
              type="text"
              value={taxCode}
              onChange={(event) => setTaxCode(event.target.value)}
              placeholder="Nhap ma so thue"
              className="h-13 w-full rounded-[8px] border-2 border-[#8fcad9] bg-white px-4 text-[1.03rem] text-slate-900 outline-none transition shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
            />
          </div>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="websiteUrlInput" className="mb-2 block text-[1.1rem] font-semibold text-slate-900">
              Website
            </label>
            <input
              id="websiteUrlInput"
              type="url"
              value={websiteUrl}
              onChange={(event) => setWebsiteUrl(event.target.value)}
              placeholder="https://company.vn"
              className="h-13 w-full rounded-[8px] border-2 border-[#8fcad9] bg-white px-4 text-[1.03rem] text-slate-900 outline-none transition shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
            />
          </div>
          <div>
            <label htmlFor="domainInput" className="mb-2 block text-[1.1rem] font-semibold text-slate-900">
              Domain doanh nghiep
            </label>
            <input
              id="domainInput"
              type="text"
              value={domain}
              onChange={(event) => setDomain(event.target.value)}
              placeholder="company.vn"
              className="h-13 w-full rounded-[8px] border-2 border-[#8fcad9] bg-white px-4 text-[1.03rem] text-slate-900 outline-none transition shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
            />
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="addressLineInput" className="mb-2 block text-[1.1rem] font-semibold text-slate-900">
            Dia chi doanh nghiep
          </label>
          <input
            id="addressLineInput"
            type="text"
            value={addressLine}
            onChange={(event) => setAddressLine(event.target.value)}
            placeholder="Nhap dia chi doanh nghiep"
            className="h-13 w-full rounded-[8px] border-2 border-[#8fcad9] bg-white px-4 text-[1.03rem] text-slate-900 outline-none transition shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
          />
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <div>
            <label htmlFor="cityInput" className="mb-2 block text-[1.1rem] font-semibold text-slate-900">
              Thanh pho
            </label>
            <input
              id="cityInput"
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Ho Chi Minh City"
              className="h-13 w-full rounded-[8px] border-2 border-[#8fcad9] bg-white px-4 text-[1.03rem] text-slate-900 outline-none transition shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
            />
          </div>
          <div>
            <label htmlFor="countryInput" className="mb-2 block text-[1.1rem] font-semibold text-slate-900">
              Quoc gia
            </label>
            <input
              id="countryInput"
              type="text"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              className="h-13 w-full rounded-[8px] border-2 border-[#8fcad9] bg-white px-4 text-[1.03rem] text-slate-900 outline-none transition shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
            />
          </div>
          <div>
            <label htmlFor="hotelCountInput" className="mb-2 block text-[1.1rem] font-semibold text-slate-900">
              So co so luu tru
            </label>
            <input
              id="hotelCountInput"
              type="number"
              min="1"
              value={hotelCount}
              onChange={(event) => setHotelCount(event.target.value)}
              className="h-13 w-full rounded-[8px] border-2 border-[#8fcad9] bg-white px-4 text-[1.03rem] text-slate-900 outline-none transition shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
            />
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="companySizeInput" className="mb-2 block text-[1.1rem] font-semibold text-slate-900">
            Quy mo doanh nghiep
          </label>
          <input
            id="companySizeInput"
            type="text"
            value={companySize}
            onChange={(event) => setCompanySize(event.target.value)}
            placeholder="Vi du: 11-50 nhan su"
            className="h-13 w-full rounded-[8px] border-2 border-[#8fcad9] bg-white px-4 text-[1.03rem] text-slate-900 outline-none transition shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
          />
        </div>

        <div className="mt-5">
          <label htmlFor="registerPasswordInput" className="mb-2 block text-[1.1rem] font-semibold text-slate-900">
            Mat khau
          </label>
          <input
            id="registerPasswordInput"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Nhap mat khau cua ban"
            className="h-13 w-full rounded-[8px] border-2 border-[#8fcad9] bg-white px-4 text-[1.03rem] text-slate-900 outline-none transition shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
          />
        </div>

        <div className="mt-5">
          <label htmlFor="confirmPasswordInput" className="mb-2 block text-[1.1rem] font-semibold text-slate-900">
            Xac nhan mat khau
          </label>
          <input
            id="confirmPasswordInput"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Nhap lai mat khau"
            className="h-13 w-full rounded-[8px] border-2 border-[#8fcad9] bg-white px-4 text-[1.03rem] text-slate-900 outline-none transition shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 h-14 w-full rounded-[6px] bg-[#006ce4] text-xl font-semibold text-white hover:bg-[#0059c2]"
        >
          {isSubmitting ? "Dang tao tai khoan..." : "Tao tai khoan"}
        </Button>

        <div className="mt-4 text-center">
          <span className="text-[1rem] text-slate-700">Da co tai khoan? </span>
          <Link href="/login" className="text-[1rem] font-semibold text-[#5a9aac] hover:underline">
            Dang nhap
          </Link>
        </div>
      </form>

      <div className="my-9 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-300" />
        <p className="text-[1.05rem] text-slate-900">hoac su dung mot trong cac lua chon nay</p>
        <div className="h-px flex-1 bg-slate-300" />
      </div>

      <div className="mb-10 flex items-center justify-center gap-6">
        <button
          type="button"
          className="flex h-22 w-22 items-center justify-center rounded-[6px] border border-slate-300 bg-white text-[2.4rem] font-semibold text-[#ea4335] transition hover:border-slate-400"
          aria-label="Dang ky bang Google"
        >
          G
        </button>
        <button
          type="button"
          className="flex h-22 w-22 items-center justify-center rounded-[6px] border border-slate-300 bg-white text-[2.4rem] font-semibold text-black transition hover:border-slate-400"
          aria-label="Dang ky bang Apple"
        >
          A
        </button>
        <button
          type="button"
          className="flex h-22 w-22 items-center justify-center rounded-[6px] border border-slate-300 bg-white text-[2.4rem] font-bold text-[#1877f2] transition hover:border-slate-400"
          aria-label="Dang ky bang Facebook"
        >
          f
        </button>
      </div>

      <div className="border-t border-slate-300 pt-6 text-center">
        <p className="mx-auto max-w-[540px] text-base leading-8 text-slate-900">
          Qua viec dang nhap hoac tao tai khoan, ban dong y voi cac{" "}
          <Link href="#" className="text-[#5a9aac] hover:underline">
            Dieu khoan va Dieu kien
          </Link>{" "}
          cung nhu{" "}
          <Link href="#" className="text-[#5a9aac] hover:underline">
            Chinh sach Bao mat
          </Link>{" "}
          cua chung toi
        </p>
        <p className="mt-5 text-[1.05rem]">Bao luu moi quyen.</p>
        <p className="mt-1 text-[1.05rem]">Ban quyen {new Date().getFullYear()} - SmartStay.com</p>
      </div>
    </>
  );
}
