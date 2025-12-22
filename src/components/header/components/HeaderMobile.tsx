/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { SearchDialog } from "../SearchDialog";
import { SheetRight } from "../sheetRight/SheetRight";
import HeaderMobileSheet from "./HeaderMobileSheet";

type CategoryNode = {
  id: string;
  categoryName: string;
  parentId: string | null;
  children?: CategoryNode[];
};

export default function HeaderMobile({
  locale,
  t,
  tree,
  loading,
  mobileMenuOpen,
  setMobileMenuOpen,
}: {
  locale: string;
  t: (k: string, def?: string) => string;
  tree: CategoryNode[];
  loading: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
}) {
  return (
    <>
      {/* MOBILE TOP BAR */}
      <header className="fixed top-0 left-0 w-full h-[64px] z-[59] bg-background border-b md:hidden">
        <div className="relative h-full px-4 flex items-center">
          {/* LEFT — MENU */}
          <button
            aria-label="open menu"
            onClick={() => setMobileMenuOpen(true)}
            className="w-10 h-10 flex items-center justify-center"
          >
            <Menu size={20} />
          </button>

          {/* CENTER — LOGO (TRUE CENTER, NOT FLEX CENTER) */}
          <Link
            href={`/${locale}/home-page`}
            aria-label="home"
            className="absolute left-1/2 -translate-x-1/2 flex items-center"
          >
            <img
              src="/order.png"
              className="w-8 h-8 object-contain"
              alt="logo"
            />
          </Link>

          {/* RIGHT — ACTIONS */}
          <div className="ml-auto flex items-center gap-2">
            <SearchDialog />
            <SheetRight />
          </div>
        </div>
      </header>

      {/* MOBILE SHEET */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
          >
            {/* overlay */}
            <div
              className="absolute inset-0"
              onClick={() => setMobileMenuOpen(false)}
            />

            <HeaderMobileSheet
              locale={locale}
              t={t}
              tree={tree}
              loading={loading}
              onClose={() => setMobileMenuOpen(false)}
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
