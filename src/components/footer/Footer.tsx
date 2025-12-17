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

  return (
    <footer className="w-full bg-white text-gray-900 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Column 1 */}
        <div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 relative rounded-md overflow-hidden bg-gray-100">
              <Image src="/logo.png" alt={t("site_name")} fill />
            </div>
            <div>
              <h4 className="text-lg font-semibold">{t("site_name")}</h4>
              <p className="text-sm text-gray-500">
                {t("footer_followers", "56,963") ?? "56,963 followers"}
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => window.open("https://facebook.com", "_blank")}
            >
              <Facebook />
            </button>
            <button
              onClick={() => window.open("https://instagram.com", "_blank")}
            >
              <Instagram />
            </button>
            <button
              onClick={() => window.open("https://youtube.com", "_blank")}
            >
              <Youtube />
            </button>
          </div>
        </div>

        {/* Help */}
        <div>
          <h3 className="font-semibold mb-4">{t("footer_menu_help")}</h3>
          <ul className="space-y-2 text-sm">
            <li
              onClick={() => go("/about")}
              className="cursor-pointer hover:underline"
            >
              {t("footer_about_us")}
            </li>
            <li
              onClick={() => go("/contact")}
              className="cursor-pointer hover:underline"
            >
              {t("footer_contact")}
            </li>
            <li
              onClick={() => go("/faq")}
              className="cursor-pointer hover:underline"
            >
              {t("footer_faq")}
            </li>
            <li
              onClick={() => go("/blog")}
              className="cursor-pointer hover:underline"
            >
              {t("footer_posts")}
            </li>
            <li
              onClick={() => go("/careers")}
              className="cursor-pointer hover:underline"
            >
              {t("footer_jobs")}
            </li>
            <li
              onClick={() => go("/branches")}
              className="cursor-pointer hover:underline"
            >
              {t("footer_branches")}
            </li>
          </ul>
        </div>

        {/* Products */}
        <div>
          <h3 className="font-semibold mb-4">{t("footer_products")}</h3>
          <ul className="space-y-2 text-sm">
            {/* IMPORTANT: goes to /category/all which CategoryPage expects */}
            <li
              onClick={() => go("/category/all")}
              className="cursor-pointer hover:underline"
            >
              {t("footer_all_products")}
            </li>
            <li
              onClick={() => go("/category/featured")}
              className="cursor-pointer hover:underline"
            >
              {t("footer_featured")}
            </li>
            <li
              onClick={() => go("/category/bestseller")}
              className="cursor-pointer hover:underline"
            >
              {t("footer_bestseller")}
            </li>
            <li
              onClick={() => go("/category/discounted")}
              className="cursor-pointer hover:underline"
            >
              {t("footer_discounted")}
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-4">{t("footer_contact")}</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone size={16} />
              99125635
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} />
              daisyshopmongol@gmail.com
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-1" />
              {t("footer_address")}
            </li>
          </ul>
        </div>
      </div>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed right-6 bottom-6 w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center"
        aria-label="Back to top"
      >
        <ArrowUp size={18} />
      </button>
    </footer>
  );
}
