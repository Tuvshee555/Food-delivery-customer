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

interface HeaderProps {
  compact?: boolean;
}

export const Header = ({ compact = false }: HeaderProps) => {
  const { locale, t } = useI18n();
  const { category } = useCategory();

  const [showHeader, setShowHeader] = useState(true);
  const [scrolled, setScrolled] = useState(compact);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [megaVisible, setMegaVisible] = useState(false);

  useEffect(() => {
    if (compact) return;

    const handleScroll = () => {
      const current = window.scrollY;
      const diff = current - lastScrollY;

      setScrolled(current > 40);
      if (diff > 5) setShowHeader(false);
      if (diff < -5) setShowHeader(true);

      setLastScrollY(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, compact]);

  return (
    <>
      {/* TopBar */}
      <div className="fixed top-0 left-0 w-full z-[60]">
        <TopBar />
      </div>

      <div className="h-[32px] md:h-[36px]" />

      <AnimatePresence>
        {showHeader && (
          <motion.header
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={`fixed left-0 w-full z-[59] ${
              scrolled
                ? "top-[32px] md:top-[36px] bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-800"
                : "top-[32px] md:top-[36px] bg-[#0a0a0a]/95 border-b border-gray-800"
            }`}
          >
            <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-6 md:px-16 py-3">
              {/* Logo */}
              <Link
                href={`/${locale}/home-page`}
                className="flex items-center gap-2"
              >
                <img
                  src="/order.png"
                  alt="logo"
                  className="w-[34px] h-[34px]"
                />
                <span className="text-white font-semibold text-[18px]">
                  NomNom
                </span>
              </Link>

              {/* NAVIGATION */}
              <nav className="hidden md:flex items-center gap-8 relative">
                {/* ⭐ All Products → Mega Menu ONLY */}
                <div
                  onMouseEnter={() => setMegaVisible(true)}
                  onMouseLeave={() => setMegaVisible(false)}
                  className="relative"
                >
                  <Link
                    href={`/${locale}/category/all`}
                    className="text-gray-300 hover:text-yellow-400 transition font-medium text-sm"
                  >
                    {t("all_products")}
                  </Link>
                </div>

                {/* OTHER CATEGORIES — normal */}
                {category.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/${locale}/category/${cat.id}`}
                    className="text-gray-300 hover:text-yellow-400 transition font-medium text-sm"
                  >
                    {cat.categoryName}
                  </Link>
                ))}
              </nav>

              {/* RIGHT SIDE */}
              <div className="flex items-center gap-3 sm:gap-[10px]">
                <SearchDialog />
                <SheetRight />
                <Email />
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* ⭐ MEGA MENU DROPDOWN ONLY for ALL PRODUCTS */}
      <AnimatePresence>
        {megaVisible && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => setMegaVisible(true)}
            onMouseLeave={() => setMegaVisible(false)}
            className="fixed left-0 
              top-[calc(32px+60px)] md:top-[calc(36px+60px)]
              w-full z-[50]
              bg-white
              border-b border-gray-200
              shadow-xl
              py-10
              px-14
              grid grid-cols-4 gap-10"
          >
            {category.map((cat) => (
              <div key={cat.id}>
                <Link
                  href={`/${locale}/category/${cat.id}`}
                  className="text-black font-semibold text-[15px] hover:text-yellow-600"
                >
                  {cat.categoryName}
                </Link>

                <ul className="mt-3 space-y-2 text-gray-600 text-sm">
                  <li className="hover:text-yellow-600 cursor-pointer">Item</li>
                  <li className="hover:text-yellow-600 cursor-pointer">Item</li>
                  <li className="hover:text-yellow-600 cursor-pointer">Item</li>
                </ul>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
