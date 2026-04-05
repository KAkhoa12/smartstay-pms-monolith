import type { Metadata } from "next";
import type { CSSProperties } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartStay PMS | Quản lý khách sạn thông minh",
  description:
    "SmartStay PMS giúp khách sạn quản lý đặt phòng, lễ tân, housekeeping và doanh thu trên một nền tảng trực quan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      data-scroll-behavior="smooth"
      className="h-full antialiased"
      style={
        {
          "--font-geist-sans":
            '"Segoe UI", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          "--font-geist-mono":
            '"Consolas", "SFMono-Regular", ui-monospace, monospace',
        } as CSSProperties
      }
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
