/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SearchDialog } from "../SearchDialog";
import { SheetRight } from "../sheetRight/SheetRight";

type CategoryNode = {
  id: string;
  categoryName: string;
  parentId: string | null;
  children?: CategoryNode[];
};

export default function HeaderDesktop({
  locale,
  t,
  category,
  tree,
  loading,
  scrolled,
  showTopBar,
  megaVisible,
  caretLeft,
  allProductsRef,
  openMega,
  closeMegaWithDelay,
  onOpenProfile,
  firstLetter,
  cartCount,
}: {
  locale: string;
  t: (k: string, def?: string) => string;
  category: CategoryNode[];
  tree: CategoryNode[];
  loading: boolean;
  scrolled: boolean;
  showTopBar: boolean;
  megaVisible: boolean;
  caretLeft: number;
  allProductsRef: React.RefObject<HTMLAnchorElement | null>;
  openMega: () => void;
  closeMegaWithDelay: () => void;
  onOpenProfile?: () => void;
  firstLetter: string;
  cartCount: number;
}) {
  return (
    <>
      <header
        className={`fixed left-0 w-full z-[59] hidden md:block transition-all duration-300
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
              <span className="text-foreground text-lg font-semibold">
                NomNom
              </span>
            </Link>

            <nav className="flex items-center gap-8">
              <Link
                ref={allProductsRef as any}
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

            <div className="flex items-center gap-3">
              <SearchDialog />
              <SheetRight cartCount={cartCount} />
              <motion.button
                onClick={() => onOpenProfile && onOpenProfile()}
                whileTap={{ scale: 0.98 }}
                aria-label={t("user")}
                className="w-[42px] h-[42px] rounded-full flex items-center justify-center bg-background border border-border text-foreground text-sm font-semibold"
              >
                {firstLetter}
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {megaVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onMouseEnter={openMega}
            onMouseLeave={closeMegaWithDelay}
            className="fixed left-0 w-full z-[70] overflow-hidden"
            style={{ top: showTopBar ? "calc(36px + 64px)" : "64px" }}
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
    </>
  );
}
