"use client";

import dynamic from "next/dynamic";

const Header = dynamic(() => import("./Header").then((m) => m.Header), {
  ssr: false,
});

export default function HeaderClient() {
  return <Header />;
}
