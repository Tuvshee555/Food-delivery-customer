/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Menu, X, Facebook, Instagram, Youtube } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchDialog } from "../SearchDialog";
import { SheetRight } from "../sheetRight/SheetRight";

type CategoryNode = {
  id: string;
  categoryName: string;
  parentId: string | null;
  children?: CategoryNode[];
};

export default function HeaderMobile({
  locale,
  tree,
  loading,
  mobileMenuOpen,
  setMobileMenuOpen,
}: {
  locale: string;
  tree: CategoryNode[];
  loading: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
}) {
  return (
    <>
      <header className="fixed top-0 left-0 w-full h-[64px] z-[59] bg-background border-b md:hidden">
        <div className="h-full px-4 flex items-center justify-between">
          <button
            aria-label="open menu"
            onClick={() => setMobileMenuOpen(true)}
            className="w-10 h-10 flex items-center justify-center"
          >
            <Menu size={20} />
          </button>

          <Link
            href={`/${locale}/home-page`}
            className="flex items-center gap-2"
          >
            <img src="/order.png" className="w-8 h-8" alt="logo" />
          </Link>

          <div className="flex items-center gap-2">
            <SearchDialog />
            <SheetRight />
          </div>
        </div>
      </header>

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
                </Link>
                <button
                  aria-label="close menu"
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
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
