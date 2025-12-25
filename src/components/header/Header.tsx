"use client";

import { useState, useEffect, useRef } from "react";
import TopBar from "./translate/TopBar";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { useCategory } from "@/hooks/useCategory";
import { useCategoryTree } from "@/hooks/useCategoryTree";
import { useEmailSync } from "./email/hooks/useEmailSync";
import HeaderDesktop from "./components/HeaderDesktop";
import HeaderMobile from "./components/HeaderMobile";

export default function Header({
  compact = false,
  onOpenProfile,
  cartCount, // ✅ ADD
}: {
  compact?: boolean;
  onOpenProfile?: () => void;
  cartCount: number; // ✅ ADD
}) {
  const { locale, t } = useI18n();

  // ✅ React Query hooks (cached, non-blocking)
  const { data: categoryData } = useCategory();
  const { data: treeData, isLoading: treeLoading } = useCategoryTree();

  const category = categoryData ?? [];
  const tree = treeData ?? [];

  const [showTopBar, setShowTopBar] = useState(true);
  const [scrolled, setScrolled] = useState(compact);
  const [megaVisible, setMegaVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const hideTimeoutRef = useRef<number | null>(null);
  const allProductsRef = useRef<HTMLAnchorElement | null>(null);
  const [caretLeft, setCaretLeft] = useState(0);

  const email = useEmailSync();
  const firstLetter = email ? email[0].toUpperCase() : "?";

  // ✅ scroll logic untouched (cheap)
  useEffect(() => {
    if (compact) return;

    const handler = () => {
      const y = window.scrollY;
      setShowTopBar(y === 0);
      setScrolled(y > 0);
    };

    window.addEventListener("scroll", handler, { passive: true });
    handler();

    return () => window.removeEventListener("scroll", handler);
  }, [compact]);

  const openMega = () => {
    if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current);
    setMegaVisible(true);

    if (allProductsRef.current) {
      const rect = allProductsRef.current.getBoundingClientRect();
      setCaretLeft(rect.left + rect.width / 2);
    }
  };

  const closeMegaWithDelay = () => {
    if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = window.setTimeout(
      () => setMegaVisible(false),
      200
    );
  };

  return (
    <>
      {showTopBar && (
        <div className="fixed top-0 left-0 w-full z-[60] hidden md:block">
          <TopBar />
        </div>
      )}

      <HeaderDesktop
        locale={locale}
        t={t}
        category={category}
        tree={tree}
        loading={treeLoading}
        scrolled={scrolled}
        showTopBar={showTopBar}
        megaVisible={megaVisible}
        caretLeft={caretLeft}
        allProductsRef={allProductsRef}
        openMega={openMega}
        closeMegaWithDelay={closeMegaWithDelay}
        onOpenProfile={onOpenProfile}
        firstLetter={firstLetter}
        cartCount={cartCount}
      />

      <HeaderMobile
        locale={locale}
        t={t}
        tree={tree}
        loading={treeLoading}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        cartCount={cartCount} // ✅ ADD
      />
    </>
  );
}
