/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Menu, X, Facebook, Instagram, Youtube } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchDialog } from "../SearchDialog";
import { SheetRight } from "../sheetRight/SheetRight";
import TranslateButton from "../translate/TranslateButton";

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
            <div className="h-full max-w-md w-full overflow-auto flex flex-col">
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

              <div className="px-4 py-4 overflow-auto">
                {loading ? (
                  <p className="text-muted-foreground">Loading…</p>
                ) : (
                  <nav className="space-y-4 pb-6">
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

                {/* small promo/photo area (replace src if you have a banner) */}
                <div className="mt-4 rounded-md overflow-hidden border border-border">
                  <img
                    src="/order.png"
                    alt="promo"
                    className="w-full object-cover"
                  />
                </div>
              </div>

              {/* bottom footer inside sheet */}
              <div className="mt-auto border-t border-border px-4 py-6 bg-background">
                <div className="space-y-2 text-sm">
                  <div className="font-medium">{t("footer_contact")}</div>
                  <a
                    href={`tel:${t("footer_phone")}`}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <span>{t("footer_phone")}</span>
                  </a>
                  <a
                    href={`mailto:${t("footer_email")}`}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <span>{t("footer_email")}</span>
                  </a>
                  <div className="text-muted-foreground text-sm">
                    {t("footer_address")}
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4">
                  <a
                    aria-label="facebook"
                    href={t("social_facebook_url") || "#"}
                    className="p-2"
                  >
                    <Facebook size={18} />
                  </a>
                  <a
                    aria-label="instagram"
                    href={t("social_instagram_url") || "#"}
                    className="p-2"
                  >
                    <Instagram size={18} />
                  </a>
                  <a
                    aria-label="youtube"
                    href={t("social_youtube_url") || "#"}
                    className="p-2"
                  >
                    <Youtube size={18} />
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">
                      {t("footer_menu_help")}
                    </h4>
                    <ul className="text-sm space-y-1">
                      {helpLinks.map(([p, k]) => (
                        <li key={p}>
                          <Link
                            href={`/${locale}${p}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block"
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
                    <ul className="text-sm space-y-1">
                      {productLinks.map(([p, k]) => (
                        <li key={p}>
                          <Link
                            href={`/${locale}${p}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block"
                          >
                            {t(k)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <TranslateButton />

                <div className="mt-4 text-center">
                  <button
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="text-sm"
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
