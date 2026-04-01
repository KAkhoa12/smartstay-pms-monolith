import SharedTopMenu from "@/components/shared-top-menu";

export default function TravelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SharedTopMenu autoCompact={false} />
      {children}
    </>
  );
}
