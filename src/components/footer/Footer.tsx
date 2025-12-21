// src/components/Footer.tsx
"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  ArrowUp,
} from "lucide-react";

export default function Footer() {
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  const { t } = useI18n();

  const go = (path: string) => {
    router.push(`/${locale}${path}`);
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
    <footer className="w-full bg-background text-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 relative rounded-md overflow-hidden bg-muted">
              <Image
                src="/order.png"
                alt={t("site_name")}
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h4 className="text-base font-semibold text-foreground">
                {t("site_name")}
              </h4>
              <p className="text-sm text-foreground">
                {t("footer_followers", "56963")}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <a
              href={t("social_facebook_url") || "https://facebook.com"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("social_facebook")}
              className="h-11 w-11 rounded-md border border-border flex items-center justify-center hover:bg-muted"
            >
              <Facebook size={18} />
            </a>

            <a
              href={t("social_instagram_url") || "https://instagram.com"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("social_instagram")}
              className="h-11 w-11 rounded-md border border-border flex items-center justify-center hover:bg-muted"
            >
              <Instagram size={18} />
            </a>

            <a
              href={t("social_youtube_url") || "https://youtube.com"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("social_youtube")}
              className="h-11 w-11 rounded-md border border-border flex items-center justify-center hover:bg-muted"
            >
              <Youtube size={18} />
            </a>
          </div>
        </div>

        {/* Help */}
        <div>
          <h3 className="text-base font-semibold mb-3 text-foreground">
            {t("footer_menu_help")}
          </h3>
          <ul className="space-y-1">
            {helpLinks.map(([path, key]) => (
              <li key={path}>
                <button
                  onClick={() => go(path)}
                  className="min-h-[44px] flex items-center w-full text-sm text-foreground hover:underline text-left"
                >
                  {t(key)}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Products */}
        <div>
          <h3 className="text-base font-semibold mb-3 text-foreground">
            {t("footer_products")}
          </h3>
          <ul className="space-y-1">
            {productLinks.map(([path, key]) => (
              <li key={path}>
                <button
                  onClick={() => go(path)}
                  className="min-h-[44px] flex items-center w-full text-sm text-foreground hover:underline text-left"
                >
                  {t(key)}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-base font-semibold mb-3 text-foreground">
            {t("footer_contact")}
          </h3>
          <ul className="space-y-2">
            <li>
              <a
                href={`tel:${t("footer_phone")}`}
                className="min-h-[44px] flex items-center gap-2 text-sm text-foreground"
              >
                <Phone size={16} />
                <span>{t("footer_phone")}</span>
              </a>
            </li>

            <li>
              <a
                href={`mailto:${t("footer_email")}`}
                className="min-h-[44px] flex items-center gap-2 text-sm text-foreground"
              >
                <Mail size={16} />
                <span>{t("footer_email")}</span>
              </a>
            </li>

            <li className="min-h-[44px] flex items-start gap-2 text-sm text-foreground">
              <MapPin size={16} className="mt-0.5" />
              <span>{t("footer_address")}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-muted"
        aria-label={t("back_to_top")}
      >
        <ArrowUp size={18} />
      </button>
    </footer>
  );
}
