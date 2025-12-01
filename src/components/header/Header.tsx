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
      {/* TopBar stays always visible */}
      <div className="fixed top-0 left-0 w-full z-[60]">
        <TopBar />
      </div>

      {/* Spacer */}
      <div className="h-[32px] md:h-[36px]" />

      <AnimatePresence>
        {showHeader && (
          <motion.header
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={`fixed left-0 w-full z-[59] transition-all duration-200 ${
              scrolled
                ? "top-[32px] md:top-[36px] bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-800 shadow-[0_0_15px_rgba(250,204,21,0.05)]"
                : "top-[32px] md:top-[36px] bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-gray-800"
            }`}
          >
            <div
              className={`w-full max-w-7xl mx-auto flex items-center justify-between transition-all duration-200 ${
                scrolled || compact
                  ? "py-2 px-5 md:px-10"
                  : "py-3 md:py-4 px-6 md:px-16"
              }`}
            >
              {/* Logo */}
              <Link
                href={`/${locale}/home-page`}
                className="flex items-center gap-2 hover:opacity-90 transition"
              >
                <img
                  src="/order.png"
                  alt="logo"
                  className={`${
                    scrolled || compact
                      ? "w-[30px] h-[30px]"
                      : "w-[38px] h-[38px]"
                  }`}
                />
                <span
                  className={`text-white font-semibold ${
                    scrolled || compact ? "text-[15px]" : "text-[18px]"
                  }`}
                >
                  NomNom
                </span>
              </Link>

              {/* 🔥 CATEGORY NAVIGATION CENTER */}
              <nav className="hidden md:flex items-center gap-8">
                {category.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/${locale}/category/${cat.id}`}
                    className="text-gray-300 hover:text-yellow-400 transition font-medium text-sm"
                  >
                    {cat.categoryName || t("unknown_category")}
                  </Link>
                ))}
              </nav>

              {/* Right Side Buttons */}
              <div className="flex items-center gap-3 sm:gap-[10px]">
                <SearchDialog />
                <SheetRight />
                <Email />
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>
    </>
  );
};
