/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { X, Facebook, Instagram, Youtube } from "lucide-react";
import TranslateButton from "../translate/TranslateButton";

type CategoryNode = {
  id: string;
  categoryName: string;
  parentId: string | null;
  children?: CategoryNode[];
};

export default function HeaderMobileSheet({
  locale,
  t,
  tree,
  loading,
  onClose,
}: {
  locale: string;
  t: (k: string, def?: string) => string;
  tree: CategoryNode[];
  loading: boolean;
  onClose: () => void;
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
    <div className="relative h-full max-w-md w-full bg-background shadow-xl overflow-auto flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div />
        <Link href={`/${locale}/home-page`} className="flex items-center gap-2">
          <img src="/order.png" className="w-8 h-8" alt="logo" />
          <span className="font-semibold">{t("site_name")}</span>
        </Link>
        <button
          aria-label="close menu"
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center"
        >
          <X size={20} />
        </button>
      </div>

      {/* BODY */}
      <div className="px-4 py-4 overflow-auto">
        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : (
          <nav className="space-y-4 pb-6">
            {/* ALL PRODUCTS */}
            <Link
              href={`/${locale}/category/all`}
              onClick={onClose}
              className="block text-lg font-semibold pb-2 border-b border-border"
            >
              {t("footer_all_products")}
            </Link>

            {/* CATEGORY TREE */}
            {tree.map((root) => (
              <div key={root.id}>
                <Link
                  href={`/${locale}/category/${root.id}`}
                  onClick={onClose}
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
                          onClick={onClose}
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

        {/* PROMO */}
        <div className="mt-4 rounded-md overflow-hidden border border-border">
          <img
            src="/order.png"
            alt="promo"
            className="w-full aspect-video object-cover"
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-auto border-t border-border px-4 py-6 bg-background space-y-4 text-sm">
        {/* CONTACT */}
        <div>
          <div className="font-medium">{t("footer_contact")}</div>
          <a href={`tel:${t("footer_phone")}`} className="block">
            {t("footer_phone")}
          </a>
          <a href={`mailto:${t("footer_email")}`} className="block truncate">
            {t("footer_email")}
          </a>
          <div className="text-muted-foreground">{t("footer_address")}</div>
        </div>

        {/* SOCIAL */}
        <div className="flex gap-3">
          <a href={t("social_facebook_url") || "#"}>
            <Facebook size={18} />
          </a>
          <a href={t("social_instagram_url") || "#"}>
            <Instagram size={18} />
          </a>
          <a href={t("social_youtube_url") || "#"}>
            <Youtube size={18} />
          </a>
        </div>

        {/* LINKS */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="font-medium mb-1">{t("footer_menu_help")}</div>
            {helpLinks.map(([p, k]) => (
              <Link
                key={p}
                href={`/${locale}${p}`}
                onClick={onClose}
                className="block"
              >
                {t(k)}
              </Link>
            ))}
          </div>

          <div>
            <div className="font-medium mb-1">{t("footer_products")}</div>
            {productLinks.map(([p, k]) => (
              <Link
                key={p}
                href={`/${locale}${p}`}
                onClick={onClose}
                className="block"
              >
                {t(k)}
              </Link>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-between">
          <TranslateButton />
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hover:underline"
          >
            {t("back_to_top")}
          </button>
        </div>
      </div>
    </div>
  );
}
