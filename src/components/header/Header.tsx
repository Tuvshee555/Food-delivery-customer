/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Facebook, Instagram, Youtube } from "lucide-react";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { useCategory } from "@/app/[locale]/provider/CategoryProvider";
import TopBar from "./translate/TopBar";
import { SearchDialog } from "./SearchDialog";
import { SheetRight } from "./sheetRight/SheetRight";
import { useEmailSync } from "./email/hooks/useEmailSync";

type CategoryNode = {
  id: string;
  categoryName: string;
  parentId: string | null;
  children?: CategoryNode[];
};

export default function Header({
  compact = false,
  onOpenProfile,
}: {
  compact?: boolean;
  onOpenProfile?: () => void;
}) {
  const { locale, t } = useI18n();
  const { category = [] } = useCategory();

  const [showTopBar, setShowTopBar] = useState(true);
  const [scrolled, setScrolled] = useState(compact);
  const [megaVisible, setMegaVisible] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const hideTimeoutRef = useRef<number | null>(null);
  const allProductsRef = useRef<HTMLAnchorElement | null>(null);
  const [caretLeft, setCaretLeft] = useState(0);

  const [tree, setTree] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(false);

  const email = useEmailSync();
  const firstLetter = email ? email[0].toUpperCase() : "?";

  // fetch category tree once
  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category/tree`)
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setTree(d))
      .finally(() => setLoading(false));
  }, []);

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

  function openMega() {
    if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current);
    setMegaVisible(true);
    if (allProductsRef.current) {
      const rect = allProductsRef.current.getBoundingClientRect();
      setCaretLeft(rect.left + rect.width / 2);
    }
  }

  function closeMegaWithDelay() {
    if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = window.setTimeout(() => {
      setMegaVisible(false);
    }, 200);
  }

  return (
    <>
      {/* TopBar: visible only on md+ (hidden on phone) */}
      {showTopBar && (
        <div className="fixed top-0 left-0 w-full z-[60] hidden md:block">
          <TopBar />
        </div>
      )}

      <header
        className={`fixed left-0 w-full z-[59] transition-all duration-300
          ${showTopBar ? "top-8 md:top-9" : "top-0"}
          ${
            scrolled
              ? "bg-background/80 backdrop-blur-xl border-b border-border"
              : "bg-background/95 border-b border-border"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-[64px] flex items-center justify-between relative">
            {/* MOBILE LEFT: hamburger */}
            <div className="flex items-center gap-3 md:hidden">
              <button
                aria-label="Open menu"
                onClick={() => setMobileMenuOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-md"
              >
                <Menu size={20} />
              </button>
            </div>

            {/* LOGO centered on mobile, left on desktop */}
            <div className="absolute left-4 right-4 top-0 bottom-0 flex items-center justify-center md:static md:flex-1 md:justify-start">
              <Link
                href={`/${locale}/home-page`}
                className="flex items-center gap-2"
              >
                <img src="/order.png" className="w-8 h-8" alt="logo" />
                <span className="text-foreground text-lg font-semibold hidden md:inline">
                  NomNom
                </span>
              </Link>
            </div>

            {/* NAV for md+ */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                ref={allProductsRef}
                href={`/${locale}/category/all`}
                onMouseEnter={openMega}
                onMouseLeave={closeMegaWithDelay}
                className="group relative h-[64px] flex items-center font-medium text-foreground"
              >
                {t("all_products")}
                <span className="absolute left-1/2 -translate-x-1/2 bottom-3 h-[2px] w-0 bg-foreground transition-all group-hover:w-10" />
              </Link>

              {category
                .filter((c) => c.parentId === null)
                .map((c) => (
                  <Link
                    key={c.id}
                    href={`/${locale}/category/${c.id}`}
                    className="group relative h-[64px] flex items-center font-medium text-foreground hover:opacity-80"
                  >
                    {c.categoryName}
                    <span className="absolute left-1/2 -translate-x-1/2 bottom-3 h-[2px] w-0 bg-foreground transition-all group-hover:w-10" />
                  </Link>
                ))}
            </nav>

            {/* ACTIONS (right) */}
            <div className="flex items-center gap-3 text-foreground ml-auto">
              {/* on mobile show search & cart icons in right */}
              <div className="flex items-center gap-2">
                <SearchDialog />
                <div className="md:hidden">
                  <SheetRight />
                </div>

                {/* Avatar trigger for md+ */}
                <div className="hidden md:block">
                  <motion.button
                    onClick={() => {
                      if (onOpenProfile) onOpenProfile();
                    }}
                    whileTap={{ scale: 0.98 }}
                    aria-label={t("user")}
                    className="w-[42px] h-[42px] rounded-full flex items-center justify-center bg-background border border-border text-foreground text-sm font-semibold"
                  >
                    {firstLetter}
                  </motion.button>
                </div>

                {/* On md+ keep SheetRight (cart) visible too */}
                <div className="hidden md:block">
                  <SheetRight />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MEGA MENU (desktop only) */}
      <AnimatePresence>
        {megaVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onMouseEnter={openMega}
            onMouseLeave={closeMegaWithDelay}
            className={`fixed left-0 w-full z-[70] overflow-hidden
              ${
                showTopBar
                  ? "top-[calc(32px+64px)] md:top-[calc(36px+64px)]"
                  : "top-[64px]"
              }`}
          >
            <div className="relative bg-card border-t border-border shadow-2xl">
              <div
                className="absolute -top-2 w-4 h-4 rotate-45 bg-card border-l border-t border-border"
                style={{ left: caretLeft }}
              />

              <div className="max-w-7xl mx-auto px-10 py-8">
                {loading ? (
                  <p className="text-muted-foreground">Loading…</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4">
                    {tree.map((root, i) => (
                      <div
                        key={root.id}
                        className={`px-6 ${
                          i !== 0 ? "md:border-l border-border" : ""
                        }`}
                      >
                        <Link
                          href={`/${locale}/category/${root.id}`}
                          className="font-semibold text-foreground"
                        >
                          {root.categoryName}
                        </Link>

                        {root.children && (
                          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                            {root.children.map((child) => (
                              <li key={child.id}>
                                <Link
                                  href={`/${locale}/category/${child.id}`}
                                  className="hover:text-foreground transition"
                                >
                                  {child.categoryName}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE CATEGORY SHEET */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.aside
            key="mobile-sheet"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[80] bg-background/95 backdrop-blur-lg"
          >
            <div className="h-full max-w-md w-full overflow-auto">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div />
                <Link
                  href={`/${locale}/home-page`}
                  className="flex items-center gap-2"
                >
                  <img src="/order.png" className="w-8 h-8" alt="logo" />
                  <span className="text-lg font-semibold">
                    {/* optional name */}
                  </span>
                </Link>
                <button
                  aria-label="Close menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="px-4 py-6">
                {loading ? (
                  <p className="text-muted-foreground">Loading…</p>
                ) : (
                  <nav className="space-y-4">
                    {tree.map((root) => (
                      <div key={root.id}>
                        <Link
                          href={`/${locale}/category/${root.id}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-lg font-semibold pb-2 border-b border-border"
                        >
                          {root.categoryName}
                        </Link>

                        {root.children && (
                          <ul className="mt-2 ml-4 space-y-1 text-sm text-muted-foreground">
                            {root.children.map((child) => (
                              <li key={child.id}>
                                <Link
                                  href={`/${locale}/category/${child.id}`}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="block py-1"
                                >
                                  {child.categoryName}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </nav>
                )}
              </div>

              {/* bottom footer inside sheet */}
              <div className="mt-auto border-t border-border px-4 py-6">
                <div className="space-y-2 text-sm">
                  <div className="font-medium">Contact</div>
                  <div className="text-muted-foreground">phone: 9912xxxx</div>
                  <div className="text-muted-foreground">
                    email: daisyshopmongol@gmail.com
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4">
                  <a aria-label="facebook" href="#" className="p-2">
                    <Facebook size={18} />
                  </a>
                  <a aria-label="instagram" href="#" className="p-2">
                    <Instagram size={18} />
                  </a>
                  <a aria-label="youtube" href="#" className="p-2">
                    <Youtube size={18} />
                  </a>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <Link href={`/${locale}/contact`} className="text-sm">
                    Contact
                  </Link>
                  <Link href={`/${locale}/about`} className="text-sm">
                    About
                  </Link>
                  <Link href={`/${locale}/jobs`} className="text-sm">
                    Jobs
                  </Link>
                </div>

                <div className="mt-4">
                  {/* language / translate control placeholder */}
                  {/* if you have TranslateButton component you can render it here */}
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
