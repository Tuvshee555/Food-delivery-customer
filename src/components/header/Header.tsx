/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

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

  const [tree, setTree] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(false);

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
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    setMegaVisible(true);
  }

  function closeMegaWithDelay() {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = window.setTimeout(() => {
      setMegaVisible(false);
    }, 200);
  }

  return (
    <>
      {showTopBar && (
        <div className="fixed top-0 left-0 w-full z-[60]">
          <TopBar />
        </div>
      )}

      {/* HEADER */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed left-0 w-full z-[59] transition-all duration-300
          ${showTopBar ? "top-8 md:top-9" : "top-0"}
          ${
            scrolled
              ? "bg-black/45 backdrop-blur-xl border-b border-white/10"
              : "bg-black/75 border-b border-white/15"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-[64px] flex items-center justify-between">
            {/* LOGO */}
            <Link
              href={`/${locale}/home-page`}
              className="flex items-center gap-2"
            >
              <img src="/order.png" className="w-8 h-8" alt="logo" />
              <span className="text-white text-lg font-semibold">NomNom</span>
            </Link>

            {/* NAV */}
            <div className="flex items-center gap-8">
              {/* ALL PRODUCTS */}
              <button
                onMouseEnter={openMega}
                onMouseLeave={closeMegaWithDelay}
                className="group relative h-[64px] text-white font-medium"
              >
                {t("all_products")}
                <span className="absolute left-1/2 -translate-x-1/2 bottom-3 h-[2px] w-0 bg-white group-hover:w-10 transition-all" />
              </button>

              {category
                .filter((c) => c.parentId === null)
                .map((c) => (
                  <Link
                    key={c.id}
                    href={`/${locale}/category/${c.id}`}
                    className="group relative h-[64px] flex items-center text-white/90 hover:text-white"
                  >
                    {c.categoryName}
                    <span className="absolute left-1/2 -translate-x-1/2 bottom-3 h-[2px] w-0 bg-white group-hover:w-10 transition-all" />
                  </Link>
                ))}
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-3">
              <SearchDialog />
              <SheetRight />
              <Email />
            </div>
          </div>
        </div>
      </motion.header>

      {/* FULL WIDTH MEGA MENU */}
      {megaVisible && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          onMouseEnter={openMega}
          onMouseLeave={closeMegaWithDelay}
          className={`fixed left-0 w-full z-[70]
            ${
              showTopBar
                ? "top-[calc(32px+64px)] md:top-[calc(36px+64px)]"
                : "top-[64px]"
            }`}
        >
          <div className="w-full bg-white shadow-2xl border-t border-black/5">
            {/* caret */}
            {/* <div className="relative max-w-7xl mx-auto">
              <div className="absolute left-[220px] -top-2 w-4 h-4 bg-white rotate-45 border-l border-t border-black/10" />
            </div> */}

            <div className="max-w-7xl mx-auto px-10 py-8">
              {loading ? (
                <p>Loading…</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                  {tree.map((root) => (
                    <div key={root.id}>
                      <Link
                        href={`/${locale}/category/${root.id}`}
                        className="font-semibold text-gray-900"
                      >
                        {root.categoryName}
                      </Link>

                      {root.children && (
                        <ul className="mt-4 space-y-2 text-sm text-gray-600">
                          {root.children.map((child) => (
                            <li key={child.id}>
                              <Link
                                href={`/${locale}/category/${child.id}`}
                                className="hover:text-black"
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
    </>
  );
};

export default Header;
