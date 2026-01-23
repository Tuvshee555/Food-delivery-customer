/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SearchDialog } from "../../SearchDialog";
import { SheetRight } from "../../sheetRight/SheetRight";

type CategoryNode = {
  id: string;
  categoryName: string;
  parentId: string | null;
};

export default function DesktopNav({
  locale,
  t,
  category,
  scrolled,
  showTopBar,
  hidden,
  allProductsRef,
  openMega,
  closeMegaWithDelay,
  onOpenProfile,
  firstLetter,
  cartCount,
}: any) {
  return (
    <header
      className={`fixed left-0 w-full z-[59] hidden md:block
        transition-transform duration-300 ease-out
        ${hidden ? "-translate-y-full" : "translate-y-0"}
        ${showTopBar ? "top-9" : "top-0"}
        ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border"
            : "bg-background/95 border-b border-border"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-[64px] flex items-center justify-between">
          <Link
            href={`/${locale}/home-page`}
            className="flex items-center gap-2"
          >
            <img src="/order1.png" className="w-8 h-8" alt="logo" />
            <span className="text-foreground text-lg font-semibold">NEXA</span>
          </Link>

          <nav className="flex items-center gap-8">
            <Link
              ref={allProductsRef}
              href={`/${locale}/category/all`}
              onMouseEnter={openMega}
              onMouseLeave={closeMegaWithDelay}
              className="group relative h-[64px] flex items-center font-medium"
            >
              {t("all_products")}
              <span className="absolute left-1/2 -translate-x-1/2 bottom-3 h-[2px] w-0 bg-foreground transition-all group-hover:w-10" />
            </Link>

            {category
              .filter((c: CategoryNode) => c.parentId === null)
              .map((c: CategoryNode) => (
                <Link
                  key={c.id}
                  href={`/${locale}/category/${c.id}`}
                  className="group relative h-[64px] flex items-center font-medium"
                >
                  {c.categoryName}
                  <span className="absolute left-1/2 -translate-x-1/2 bottom-3 h-[2px] w-0 bg-foreground transition-all group-hover:w-10" />
                </Link>
              ))}
          </nav>

          <div className="flex items-center gap-3">
            <SearchDialog />
            <SheetRight cartCount={cartCount} />
            <motion.button
              onClick={() => onOpenProfile?.()}
              whileTap={{ scale: 0.98 }}
              className="w-[42px] h-[42px] rounded-full border flex items-center justify-center font-semibold"
            >
              {firstLetter}
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}
