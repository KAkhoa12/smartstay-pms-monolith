"use client";

type DestinationRequiredMessageProps = {
  message: string;
  className?: string;
};

export default function DestinationRequiredMessage({
  message,
  className = "",
}: DestinationRequiredMessageProps) {
  if (!message) return null;

  return (
    <p
      className={`absolute left-0 top-[calc(100%+6px)] z-40 inline-flex rounded bg-[#d90f24] px-3 py-1 text-xs font-semibold text-white shadow-md ${className}`}
    >
      {message}
    </p>
  );
}
