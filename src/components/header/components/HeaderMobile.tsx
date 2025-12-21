/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Menu, X, Facebook, Instagram, Youtube } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchDialog } from "../SearchDialog";
import TranslateButton from "../translate/TranslateButton";
import { SheetRight } from "../sheetRight/SheetRight";

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
  const helpLinks: [string, string][] = [
    ["/about", "footer_about_us"],
    ["/contact", "footer_contact"],
    ["/faq", "footer_faq"],
    ["/blog", "footer_posts"],
    ["/careers", "footer_jobs"],
    ["/branches", "footer_branches"],
  ];

  const productLinks: [string, string][] = [
    ["/category/all", "footer_all_products"],
    ["/category/featured", "footer_featured"],
    ["/category/bestseller", "footer_bestseller"],
    ["/category/discounted", "footer_discounted"],
  ];

  return (
    <>
      {/* Mobile top bar */}
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

      {/* Mobile sheet */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.aside
            key="mobile-sheet"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[80] bg-background/50 backdrop-blur-sm"
            aria-modal="true"
            role="dialog"
          >
            {/* clickable overlay to close */}
            <div
              className="absolute inset-0"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* sheet container */}
            <div className="relative h-full max-w-md w-full bg-background shadow-xl overflow-auto flex flex-col">
              {/* header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div />
                <Link
                  href={`/${locale}/home-page`}
                  className="flex items-center gap-2"
                >
                  <img src="/order.png" className="w-8 h-8" alt="logo" />
                  <span className="font-semibold">{t("site_name")}</span>
                </Link>
                <button
                  aria-label="close menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </div>

              {/* body: categories + promo */}
              <div className="px-4 py-4 overflow-auto">
                {loading ? (
                  <p className="text-muted-foreground">Loading…</p>
                ) : (
                  <nav className="space-y-4 pb-6">
                    {/* All products at top */}
                    <div>
                      <Link
                        href={`/${locale}/category/all`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-lg font-semibold pb-2 border-b border-border"
                      >
                        {t("footer_all_products")}
                      </Link>
                    </div>

                    {/* category tree */}
                    {tree.map((root) => (
                      <div key={root.id}>
                        <Link
                          href={`/${locale}/category/${root.id}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-lg font-semibold py-2"
                        >
                          {root.categoryName}
                        </Link>

                        {root.children && (
                          <ul className="mt-2 ml-3 space-y-1 text-sm text-muted-foreground">
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

                {/* promo/photo area — clean card style */}
                <div className="mt-4 rounded-md overflow-hidden border border-border">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src="/order.png"
                      alt="promo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* footer inside sheet */}
              <div className="mt-auto border-t border-border px-4 py-6 bg-background">
                {/* contact */}
                <div className="space-y-2 text-sm">
                  <div className="font-medium">{t("footer_contact")}</div>

                  <a
                    href={`tel:${t("footer_phone")}`}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <span className="font-medium">{t("footer_phone")}</span>
                  </a>

                  <a
                    href={`mailto:${t("footer_email")}`}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <span className="truncate">{t("footer_email")}</span>
                  </a>

                  <div className="text-muted-foreground text-sm">
                    {t("footer_address")}
                  </div>
                </div>

                {/* socials */}
                <div className="flex items-center gap-4 mt-4">
                  <a
                    aria-label="facebook"
                    href={t("social_facebook_url") || "#"}
                    className="p-2 rounded-md hover:bg-muted"
                  >
                    <Facebook size={18} />
                  </a>
                  <a
                    aria-label="instagram"
                    href={t("social_instagram_url") || "#"}
                    className="p-2 rounded-md hover:bg-muted"
                  >
                    <Instagram size={18} />
                  </a>
                  <a
                    aria-label="youtube"
                    href={t("social_youtube_url") || "#"}
                    className="p-2 rounded-md hover:bg-muted"
                  >
                    <Youtube size={18} />
                  </a>
                </div>

                {/* help & products */}
                <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                  <div>
                    <h4 className="font-medium text-sm mb-2">
                      {t("footer_menu_help")}
                    </h4>
                    <ul className="space-y-1">
                      {helpLinks.map(([p, k]) => (
                        <li key={p}>
                          <Link
                            href={`/${locale}${p}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-foreground"
                          >
                            {t(k)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">
                      {t("footer_products")}
                    </h4>
                    <ul className="space-y-1">
                      {productLinks.map(([p, k]) => (
                        <li key={p}>
                          <Link
                            href={`/${locale}${p}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-foreground"
                          >
                            {t(k)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* translate button + back to top */}
                <div className="mt-4 flex items-center justify-between gap-4">
                  <TranslateButton />
                  <button
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="text-sm text-foreground hover:underline"
                  >
                    {t("back_to_top")}
                  </button>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
