"use client";

import { ReactNode, useState, useCallback } from "react";
import Footer from "@/components/footer/Footer";
import MobileBottomNav from "@/components/navigation/MobileBottomNav";
import Email from "@/components/header/email/Email"; // path to controlled Email
import HeaderClient from "./header/HeaderClient";

export default function AppShellClient({ children }: { children: ReactNode }) {
  const [emailOpen, setEmailOpen] = useState(false);

  // stable handlers
  const openProfile = useCallback(() => setEmailOpen(true), []);
  const onOpenChange = useCallback((v: boolean) => setEmailOpen(v), []);

  return (
    <>
      <HeaderClient onOpenProfile={openProfile} />
      {/* main content area is passed as children from layout */}
      <main className="min-h-screen pt-24 pb-28">{children}</main>

      <Footer />

      {/* mobile only bottom nav, receives the same opener */}
      <MobileBottomNav onOpenProfile={openProfile} />

      {/* Controlled Email sheet (single source of truth) */}
      <Email open={emailOpen} onOpenChange={onOpenChange} />
    </>
  );
}
