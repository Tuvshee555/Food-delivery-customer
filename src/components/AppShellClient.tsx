"use client";

import { ReactNode, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

import Footer from "@/components/footer/Footer";
import FooterPolicies from "./footer/FooterPolicies";
import MobileBottomNav from "@/components/navigation/MobileBottomNav";
import Email from "@/components/header/email/Email";
import HeaderClient from "./header/HeaderClient";
import { useCartSync } from "./header/sheetRight/components/useCartSync";
import TopLoader from "./header/TopLoader";

export default function AppShellClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [emailOpen, setEmailOpen] = useState(false);

  const cartCount = useCartSync();

  const openProfile = useCallback(() => setEmailOpen(true), []);
  const onOpenChange = useCallback((v: boolean) => setEmailOpen(v), []);

  // ✅ footer logic
  // route checks
  const isCatalogPage =
    pathname?.includes("/food/") || pathname?.includes("/category/");

  const isHome =
    pathname === "/mn" ||
    pathname === "/en" ||
    pathname === "/ko" ||
    pathname === "/mn/home-page" ||
    pathname === "/en/home-page" ||
    pathname === "/ko/home-page";

  return (
    <>
      {/* 🔥 GLOBAL TOP LOADER */}
      <TopLoader />

      <HeaderClient onOpenProfile={openProfile} cartCount={cartCount} />

      <main className="min-h-screen pt-[64px] md:pt-24">{children}</main>

      {/* ✅ ROUTE-BASED FOOTER */}
      {isCatalogPage && <FooterPolicies />}
      {isHome && <Footer />}

      <MobileBottomNav onOpenProfile={openProfile} />
      <Email open={emailOpen} onOpenChange={onOpenChange} />
    </>
  );
}
