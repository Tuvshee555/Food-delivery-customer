"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  Facebook,
  Instagram,
  Youtube,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
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
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setExpanded((s) => ({ ...s, [id]: !s[id] }));

  const isExpanded = (id: string) => !!expanded[id];

  const renderNode = (node: CategoryNode, depth = 0) => {
    const hasChildren = !!(node.children && node.children.length);
    const expandedState = isExpanded(node.id);

    return (
      <div key={node.id} className="flex flex-col">
        <div
          className={`flex items-center justify-between select-none ${
            depth > 0 ? "pl-5" : ""
          }`}
        >
          {hasChildren ? (
            <button
              onClick={() => toggle(node.id)}
              aria-expanded={expandedState}
              className="flex-1 text-left py-4 px-1 flex items-center gap-3"
            >
              <span className="truncate text-base md:text-lg">
                {node.categoryName}
              </span>
            </button>
          ) : (
            <Link
              href={`/${locale}/category/${node.id}`}
              onClick={onClose}
              className="flex-1 py-4 px-1"
            >
              <span className="truncate text-base md:text-lg">
                {node.categoryName}
              </span>
            </Link>
          )}

          <div className="w-10 h-10 flex items-center justify-center">
            {hasChildren ? (
              <motion.div
                animate={{ rotate: expandedState ? 90 : 0 }}
                transition={{ duration: 0.18 }}
                style={{ display: "flex" }}
              >
                <ChevronRight size={20} />
              </motion.div>
            ) : (
              <ChevronRight size={18} />
            )}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {hasChildren && expandedState && (
            <motion.ul
              key={`${node.id}-children`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <div className="ml-4">
                {node.children!.map((child) => (
                  <motion.li
                    key={child.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.18 }}
                  >
                    {renderNode(child, depth + 1)}
                  </motion.li>
                ))}
              </div>
            </motion.ul>
          )}
        </AnimatePresence>

        <div className="h-px bg-border/60" />
      </div>
    );
  };

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
    // positioned absolutely to left so it's anchored to the left side of the overlay
    <div className="absolute left-0 top-0 h-full w-[80vw] max-w-[380px] bg-background shadow-xl z-[81] overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div />
          <button
            aria-label="close menu"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 px-4 py-4 overflow-auto">
          {loading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : (
            <nav className="space-y-3 pb-6">
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/${locale}/category/all`}
                    onClick={() => {
                      onClose();
                    }}
                    className="flex-1 py-4 px-1"
                  >
                    <span className="text-base md:text-lg truncate">
                      {t("footer_all_products")}
                    </span>
                  </Link>
                  <div className="w-10 h-10 flex items-center justify-center">
                    <ChevronRight size={18} />
                  </div>
                </div>
                <div className="h-px bg-border/60" />
              </div>

              <div className="mt-2 space-y-1">
                {tree.map((root) => renderNode(root))}
              </div>

              {/* footer inside scrollable content */}
              <div className="border-t border-border pt-6 pb-8 mt-6 space-y-6 text-base">
                {/* Help links */}
                <div className="flex flex-col gap-3">
                  <div className="font-medium text-base">
                    {t("footer_menu_help")}
                  </div>
                  <div className="flex flex-col gap-2 text-muted-foreground text-sm">
                    {helpLinks.map(([p, k]) => (
                      <Link
                        key={p}
                        href={`/${locale}${p}`}
                        onClick={onClose}
                        className="block py-1"
                      >
                        {t(k)}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Product links */}
                <div className="flex flex-col gap-3">
                  <div className="font-medium text-base">
                    {t("footer_products")}
                  </div>
                  <div className="flex flex-col gap-2 text-muted-foreground text-sm">
                    {productLinks.map(([p, k]) => (
                      <Link
                        key={p}
                        href={`/${locale}${p}`}
                        onClick={onClose}
                        className="block py-1"
                      >
                        {t(k)}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="font-medium text-base">
                  {t("footer_contact")}
                </div>

                <div className="flex flex-col gap-2 text-muted-foreground text-sm items-start">
                  <a
                    href={`tel:${t("footer_phone")}`}
                    className="flex items-center gap-3 py-1"
                  >
                    <Phone size={18} />
                    <span>{t("footer_phone")}</span>
                  </a>

                  <a
                    href={`mailto:${t("footer_email")}`}
                    className="flex items-center gap-3 py-1"
                  >
                    <Mail size={18} />
                    <span className="truncate">{t("footer_email")}</span>
                  </a>

                  <div className="flex items-start gap-3 py-1">
                    <MapPin size={18} />
                    <span className="text-sm text-muted-foreground">
                      {t("footer_address")}
                    </span>
                  </div>
                </div>

                {/* Contact + centered social & translate */}
                <div className="flex flex-col gap-3 items-center text-center">
                  {/* social icons centered */}
                  <div className="flex items-center gap-6 mt-2">
                    <a
                      href={t("social_facebook_url") || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="facebook"
                      className="p-1"
                    >
                      <Facebook size={20} />
                    </a>
                    <a
                      href={t("social_instagram_url") || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="instagram"
                      className="p-1"
                    >
                      <Instagram size={20} />
                    </a>
                    <a
                      href={t("social_youtube_url") || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="youtube"
                      className="p-1"
                    >
                      <Youtube size={20} />
                    </a>
                  </div>

                  {/* Translate button centered under icons */}
                  <div className="mt-3">
                    <TranslateButton />
                  </div>

                  {/* small centered copyright/brand line */}
                  <div className="mt-4 text-xs text-muted-foreground">
                    © {new Date().getFullYear()} {t("footer_small_text") || ""}
                  </div>
                </div>
              </div>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
