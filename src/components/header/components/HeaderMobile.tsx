/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Menu, ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
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
  cartCount,
}: {
  locale: string;
  t: (k: string, def?: string) => string;
  tree: CategoryNode[];
  loading: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
  cartCount: number;
}) {
  const pathname = usePathname() ?? `/${locale}`;
  const search = useSearchParams();
  const router = useRouter();

  const tab = search?.get("tab") ?? "";
  const pathAfterLocale = pathname.replace(`/${locale}`, "") || "/";

  const isFoodDetail = pathAfterLocale.startsWith("/food/");

  // decide variant
  const isHome =
    pathAfterLocale === "/" ||
    pathAfterLocale === "/home-page" ||
    pathAfterLocale === "" ||
    pathAfterLocale === "/mn"; /* defensive */
  const isCategory = pathAfterLocale.startsWith("/category");
  const isProfile = pathAfterLocale.startsWith("/profile");

  const title = (() => {
    if (isHome) return null;
    if (isCategory) return t("products", "Бүтээгдэхүүнүүд");
    if (isFoodDetail) return t("products", "Бүтээгдэхүүнүүд");

    if (isProfile) {
      if (tab === "profile") return t("profile", "Профайл");
      if (tab === "orders") return t("orders", "Захиалгууд");
      if (tab === "tickets") return t("tickets", "Тасалбар");
      return t("profile", "Профайл");
    }

    // fallback ONLY for readable routes
    const seg = pathAfterLocale.split("/").filter(Boolean).pop();
    if (!seg || /^[a-f0-9-]{8,}$/i.test(seg)) return null;

    return seg.replace(/[-_]/g, " ").toUpperCase();
  })();

  const showBack = !!title;
  const showSearch = !showBack; // search only on home/browse
  const centerIsLogo = !showBack;

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-[64px] z-[59] bg-background border-b md:hidden">
        <div className="relative h-full px-4 flex items-center">
          {/* LEFT */}
          {showBack ? (
            <button
              aria-label="back"
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center"
            >
              <ArrowLeft size={20} />
            </button>
          ) : (
            <button
              aria-label="open menu"
              onClick={() => setMobileMenuOpen(true)}
              className="w-10 h-10 flex items-center justify-center"
            >
              <Menu size={20} />
            </button>
          )}

          {/* CENTER */}
          {centerIsLogo ? (
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
          ) : (
            <div className="absolute left-1/2 -translate-x-1/2">
              <h1 className="text-sm font-medium">{title}</h1>
            </div>
          )}

          {/* RIGHT */}
          <div className="ml-auto flex items-center gap-2">
            {showSearch && <SearchDialog />}
            <SheetRight cartCount={cartCount} />
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
