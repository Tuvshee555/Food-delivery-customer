/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { useCategory } from "@/app/[locale]/provider/CategoryProvider";
import TopBar from "./translate/TopBar";
import { SearchDialog } from "./SearchDialog";
import { SheetRight } from "./sheetRight/SheetRight";
import { Email } from "./email/Email";

type CategoryNode = {
  id: string;
  categoryName: string;
  parentId: string | null;
  children?: CategoryNode[];
};

export const Header = ({ compact = false }: { compact?: boolean }) => {
  const { locale, t } = useI18n();
  const { category = [] } = useCategory();

  const [showTopBar, setShowTopBar] = useState(true);
  const [scrolled, setScrolled] = useState(compact);
  const [megaVisible, setMegaVisible] = useState(false);

  const hideTimeoutRef = useRef<number | null>(null);
  const allProductsRef = useRef<HTMLAnchorElement | null>(null);
  const [caretLeft, setCaretLeft] = useState(0);

  const [tree, setTree] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(false);

  /* ======================
     FETCH CATEGORY TREE
     ====================== */
  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category/tree`)
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setTree(d))
      .finally(() => setLoading(false));
  }, []);

  /* ======================
     SCROLL BEHAVIOR
     ====================== */
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

  /* ======================
     MEGA MENU CONTROL
     ====================== */
  function openMega() {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    setMegaVisible(true);

    if (allProductsRef.current) {
      const rect = allProductsRef.current.getBoundingClientRect();
      setCaretLeft(rect.left + rect.width / 2);
    }
  }

  function closeMegaWithDelay() {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = window.setTimeout(() => {
      setMegaVisible(false);
    }, 200);
  }

  return (
    <>
      {/* TOP BAR */}
      {showTopBar && (
        <div className="fixed top-0 left-0 w-full z-[60]">
          <TopBar />
        </div>
      )}

      {/* HEADER */}
      <header
        className={`
          fixed left-0 w-full z-[59] transition-all duration-300
          ${showTopBar ? "top-8 md:top-9" : "top-0"}
          ${
            scrolled
              ? "bg-background/80 backdrop-blur-xl border-b border-border"
              : "bg-background/95 border-b border-border"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-[64px] flex items-center justify-between">
            {/* LOGO */}
            <Link
              href={`/${locale}/home-page`}
              className="flex items-center gap-2"
            >
              <img src="/order.png" className="w-8 h-8" alt="logo" />
              <span className="text-foreground text-lg font-semibold">
                NomNom
              </span>
            </Link>

            {/* NAV */}
            <nav className="flex items-center gap-8">
              {/* ALL PRODUCTS */}
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

              {/* OTHER CATEGORIES — NOW SHARP */}
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

            {/* ACTIONS */}
            <div className="flex items-center gap-3 text-foreground">
              <SearchDialog />
              <SheetRight />
              <Email />
            </div>
          </div>
        </div>
      </header>

      {/* MEGA MENU */}
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
              }
            `}
          >
            <div className="relative bg-card border-t border-border shadow-2xl">
              {/* CARET */}
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
    </>
  );
};

export default Header;
