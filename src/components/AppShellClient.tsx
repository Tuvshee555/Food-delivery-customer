"use client";

import { ReactNode, useState, useCallback } from "react";
import Footer from "@/components/footer/Footer";
import MobileBottomNav from "@/components/navigation/MobileBottomNav";
import Email from "@/components/header/email/Email";
import HeaderClient from "./header/HeaderClient";
import { useCartSync } from "./header/sheetRight/components/useCartSync";
import TopLoader from "./header/TopLoader";

export default function AppShellClient({ children }: { children: ReactNode }) {
  const [emailOpen, setEmailOpen] = useState(false);

  // ✅ SINGLE cart sync for entire app lifetime
  const cartCount = useCartSync();

  const openProfile = useCallback(() => setEmailOpen(true), []);
  const onOpenChange = useCallback((v: boolean) => setEmailOpen(v), []);

  return (
    <>
      {/* 🔥 GLOBAL TOP LOADER */}
      <TopLoader />

      <HeaderClient onOpenProfile={openProfile} cartCount={cartCount} />

      <main className="min-h-screen pt-[64px] md:pt-24">{children}</main>

      <Footer />
      <MobileBottomNav onOpenProfile={openProfile} />
      <Email open={emailOpen} onOpenChange={onOpenChange} />
    </>
  );
}
