"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type HotelImageGalleryProps = {
  images: string[];
  hotelName: string;
};

export default function HotelImageGallery({ images, hotelName }: HotelImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images.length) return null;

  const goToIndex = (index: number) => {
    const nextIndex = Math.max(0, Math.min(images.length - 1, index));
    setActiveIndex(nextIndex);
  };

  const goPrevious = () => goToIndex(activeIndex - 1);
  const goNext = () => goToIndex(activeIndex + 1);

  return (
    <section className="overflow-hidden rounded-[28px] bg-white p-4 shadow-[0_18px_40px_rgba(31,62,83,0.12)]">
      <div className="relative overflow-hidden rounded-[24px] bg-slate-100">
        <img
          src={images[activeIndex]}
          alt={`${hotelName} ${activeIndex + 1}`}
          className="h-[340px] w-full object-cover lg:h-[480px]"
        />

        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={goPrevious}
              disabled={activeIndex === 0}
              aria-label="Anh truoc"
              className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-slate-700 shadow-md transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={activeIndex === images.length - 1}
              aria-label="Anh sau"
              className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-slate-700 shadow-md transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        ) : null}

        <div className="absolute bottom-4 right-4 rounded-full bg-slate-900/62 px-3 py-1 text-sm font-semibold text-white">
          {activeIndex + 1}/{images.length}
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-3 overflow-x-auto pb-1">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => goToIndex(index)}
            className={`relative shrink-0 overflow-hidden rounded-[18px] transition ${
              activeIndex === index
                ? "ring-2 ring-[#1791e6] ring-offset-2 ring-offset-white"
                : "opacity-70 hover:opacity-100"
            }`}
            aria-label={`Xem anh ${index + 1}`}
          >
            <img
              src={image}
              alt={`${hotelName} thumbnail ${index + 1}`}
              className="h-20 w-28 object-cover sm:h-24 sm:w-36"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
