/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { useCategory } from "@/app/[locale]/provider/CategoryProvider";
import { SearchDialog } from "./SearchDialog";
import { SheetRight } from "./sheetRight/SheetRight";
import { Email } from "./email/Email";
import TopBar from "./translate/TopBar";

type CategoryNode = {
  id: string;
  categoryName: string;
  parentId: string | null;
  children?: CategoryNode[];
};

export const Header = ({ compact = false }: { compact?: boolean }) => {
  const { locale, t } = useI18n();
  const { category } = useCategory();

  const [showTopBar, setShowTopBar] = useState(true);
  const [scrolled, setScrolled] = useState(compact);
  const [megaVisible, setMegaVisible] = useState(false);

  const [tree, setTree] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/tree`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setTree(data))
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

  const navClass =
    "relative text-white/70 hover:text-white text-[13px] tracking-wide transition group";
  const underline =
    "absolute left-0 -bottom-1 h-[1px] w-0 bg-white/70 group-hover:w-full transition-all duration-300";

  return (
    <>
      {showTopBar && (
        <div className="fixed top-0 left-0 w-full z-[60]">
          <TopBar />
        </div>
      )}

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed left-0 w-full z-[59] transition-all duration-300
          ${showTopBar ? "top-[32px] md:top-[36px]" : "top-0"}
          ${
            scrolled
              ? "bg-black/45 backdrop-blur-xl border-b border-white/10"
              : "bg-black/75 border-b border-white/15"
          }
        `}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-14 py-2">
          <Link
            href={`/${locale}/home-page`}
            className="flex items-center gap-2 select-none"
          >
            <img src="/order.png" alt="logo" className="w-8 h-8 opacity-90" />
            <span className="text-white font-semibold tracking-wide text-lg">
              NomNom
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-9">
            <div
              className="group"
              onMouseEnter={() => setMegaVisible(true)}
              onMouseLeave={() => setMegaVisible(false)}
            >
              <Link href={`/${locale}/category/all`} className={navClass}>
                {t("all_products")}
                <span className={underline} />
              </Link>
            </div>

            {category
              .filter((c) => c.parentId === null)
              .map((c) => (
                <div key={c.id} className="group">
                  <Link
                    href={`/${locale}/category/${c.id}`}
                    className={navClass}
                  >
                    {c.categoryName}
                    <span className={underline} />
                  </Link>
                </div>
              ))}
          </nav>

          <div className="flex items-center gap-3 text-white/85">
            <SearchDialog />
            <SheetRight />
            <Email />
          </div>
        </div>
      </motion.header>

      {megaVisible && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          onMouseEnter={() => setMegaVisible(true)}
          onMouseLeave={() => setMegaVisible(false)}
          className="fixed left-0 w-full z-[55] bg-white/95 backdrop-blur-2xl border-b border-black/10 shadow-[0_30px_70px_rgba(0,0,0,0.14)] rounded-b-2xl top-[calc(32px+56px)] md:top-[calc(36px+56px)] py-8 px-14 grid grid-cols-2 md:grid-cols-4 gap-12"
        >
          {loading ? (
            <p className="text-gray-500 text-sm">Loading…</p>
          ) : (
            tree.map((root) => (
              <div key={root.id}>
                <Link
                  href={`/${locale}/category/${root.id}`}
                  className="block font-medium text-gray-900 tracking-wide hover:text-black"
                >
                  {root.categoryName}
                </Link>

                {root.children && (
                  <ul className="mt-3 space-y-2">
                    {root.children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={`/${locale}/category/${child.id}`}
                          className="text-[13px] text-gray-600 hover:text-black transition"
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
    </>
  );
};

export default Header;
