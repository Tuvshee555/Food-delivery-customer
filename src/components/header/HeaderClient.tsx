"use client";

import dynamic from "next/dynamic";

const Header = dynamic(() => import("./Header").then((m) => m.default), {
  ssr: false,
});

export default function HeaderClient({
  onOpenProfile,
}: {
  onOpenProfile?: () => void;
}) {
  return <Header onOpenProfile={onOpenProfile} />;
}
