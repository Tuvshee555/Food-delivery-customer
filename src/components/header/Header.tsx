"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AddLocation } from "./AddLocation";
import { SheetRight } from "./SheetRight";
import { Email } from "./Email";
import { SearchDialog } from "./SearchDialog";

interface HeaderProps {
  compact?: boolean; // 👈 new prop
}

export const Header = ({ compact = false }: HeaderProps) => {
  const [open, setOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [scrolled, setScrolled] = useState(compact); // 👈 start scrolled if compact
  const [lastScrollY, setLastScrollY] = useState(0);

  // 🧠 Scroll logic (only active when not compact)
  useEffect(() => {
    if (compact) return;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrolled(currentScroll > 60);
      if (currentScroll > lastScrollY + 10 && currentScroll > 120) {
        setShowHeader(false);
      } else if (currentScroll < lastScrollY - 10) {
        setShowHeader(true);
      }
      setLastScrollY(currentScroll);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, compact]);

  return (
    <AnimatePresence>
      {showHeader && (
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
            scrolled
              ? "bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-800 scale-[0.98] shadow-[0_0_25px_rgba(250,204,21,0.05)]"
              : "bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-gray-800"
          }`}
        >
          <div
            className={`w-full max-w-7xl mx-auto flex justify-between items-center transition-all duration-300 ${
              scrolled || compact
                ? "py-2 px-5 md:px-10"
                : "py-3 md:py-4 px-6 md:px-16"
            }`}
          >
            {/* 🔰 Logo */}
            <Link
              href="/home-page"
              className="flex items-center gap-2 hover:opacity-90 transition"
            >
              <img
                src="/order.png"
                alt="logo"
                className={`transition-all duration-300 ${
                  scrolled || compact
                    ? "w-[30px] h-[30px]"
                    : "w-[38px] h-[38px]"
                }`}
              />
              <div className="flex flex-col leading-tight">
                <span
                  className={`font-semibold text-white transition-all duration-300 ${
                    scrolled || compact ? "text-[15px]" : "text-[18px]"
                  }`}
                >
                  NomNom
                </span>
                <span
                  className={`text-[#71717a] transition-all duration-300 ${
                    scrolled || compact ? "text-[10px]" : "text-[12px]"
                  }`}
                >
                  Swift delivery
                </span>
              </div>
            </Link>

            {/* ⚙️ Right-side buttons */}
            <div className="flex items-center gap-3 sm:gap-[10px]">
              <AddLocation open={open} onOpenChange={setOpen} />
              <SearchDialog />
              <SheetRight />
              <Email />
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
};
