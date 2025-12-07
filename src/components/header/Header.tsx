/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SearchDialog } from "./SearchDialog";
import { SheetRight } from "./sheetRight/SheetRight";
import { Email } from "./email/Email";
import TopBar from "./translate/TopBar";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { useCategory } from "@/app/[locale]/provider/CategoryProvider";
import { useRef } from "react";

interface HeaderProps {
  compact?: boolean;
}

type CategoryNode = {
  id: string;
  categoryName: string;
  parentId: string | null;
  children?: CategoryNode[];
};

export const Header = ({ compact = false }: HeaderProps) => {
  const { locale, t } = useI18n();
  const { category } = useCategory();

  const [showHeader, setShowHeader] = useState(true);
  const [scrolled, setScrolled] = useState(compact);
  const [megaVisible, setMegaVisible] = useState(false);

  const [tree, setTree] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category/tree`)
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setTree(data))
      .finally(() => setLoading(false));
  }, []);

  const lastScrollYRef = useRef(0);

  useEffect(() => {
    if (compact) return;

    const handler = () => {
      const y = window.scrollY;
      setScrolled(y > 40);

      setShowHeader(y < 200 || y < lastScrollYRef.current);

      lastScrollYRef.current = y;
    };

    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [compact]);

  const navClass =
    "relative text-gray-300 hover:text-yellow-300 font-medium text-sm transition group";

  const underline =
    "block w-0 h-[2px] bg-yellow-400 group-hover:w-full transition-all duration-300 mx-auto";

  return (
    <>
      {/* TOPBAR */}
      <div className="fixed top-0 left-0 w-full z-[60]">
        <TopBar />
      </div>

      <div className="h-[32px] md:h-[36px]" />

      {/* HEADER */}
      <AnimatePresence>
        {showHeader && (
          <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed left-0 w-full z-[59] transition-all duration-300 border-b ${
              scrolled
                ? "top-[32px] md:top-[36px] bg-black/30 backdrop-blur-xl border-gray-800 shadow-lg"
                : "top-[32px] md:top-[36px] bg-black/65 border-gray-700"
            }`}
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-16 py-3">
              {/* LOGO */}
              <Link
                href={`/${locale}/home-page`}
                className="flex items-center gap-3"
              >
                <img
                  src="/order.png"
                  alt="logo"
                  className="w-[36px] h-[36px]"
                />
                <span className="text-white font-bold text-xl">NomNom</span>
              </Link>

              {/* NAV */}
              <nav className="hidden md:flex items-center gap-8">
                {/* ALL PRODUCTS (MEGA TRIGGER) */}
                <div
                  className="group"
                  onMouseEnter={() => setMegaVisible(true)}
                  onMouseLeave={() => setMegaVisible(false)}
                >
                  <Link href={`/${locale}/category/all`} className={navClass}>
                    {t("all_products")}
                    <span className={underline}></span>
                  </Link>
                </div>

                {/* ROOT CATS */}
                {category
                  .filter((c) => c.parentId === null)
                  .map((c) => (
                    <div key={c.id} className="group">
                      <Link
                        href={`/${locale}/category/${c.id}`}
                        className={navClass}
                      >
                        {c.categoryName}
                        <span className={underline}></span>
                      </Link>
                    </div>
                  ))}
              </nav>

              {/* ACTIONS */}
              <div className="flex items-center gap-4">
                <SearchDialog />
                <SheetRight />
                <Email />
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* MEGA MENU */}
      <AnimatePresence>
        {megaVisible && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onMouseEnter={() => setMegaVisible(true)}
            onMouseLeave={() => setMegaVisible(false)}
            className="fixed w-full left-0 bg-white/95 backdrop-blur-xl 
            rounded-b-3xl shadow-2xl border-b border-gray-300
            top-[calc(32px+65px)] md:top-[calc(36px+65px)]
            py-10 px-16 grid grid-cols-2 md:grid-cols-4 gap-10 z-[55]"
          >
            {loading ? (
              <p className="text-gray-500">Loading…</p>
            ) : (
              tree.map((root) => (
                <div key={root.id}>
                  <Link
                    href={`/${locale}/category/${root.id}`}
                    className="text-[15px] font-semibold text-gray-900 hover:text-yellow-600 transition"
                  >
                    {root.categoryName}
                  </Link>

                  {root.children && (
                    <ul className="mt-3 space-y-2">
                      {root.children.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={`/${locale}/category/${child.id}`}
                            className="text-gray-600 text-sm hover:text-yellow-600 transition"
                          >
                            {child.categoryName}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
