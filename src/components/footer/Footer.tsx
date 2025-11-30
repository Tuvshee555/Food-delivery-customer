"use client";

import { useI18n } from "@/components/i18n/ClientI18nProvider";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="w-full bg-black text-white py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Column 1 */}
        <div>
          <p className="text-sm leading-relaxed mb-4">{t("footer_org_desc")}</p>

          <div className="w-full bg-[#111] p-3 rounded" />

          {/* Social Icons */}
          <div className="flex gap-4 mt-5">
            <i className="fa-brands fa-facebook text-2xl"></i>
            <i className="fa-brands fa-instagram text-2xl"></i>
            <i className="fa-brands fa-youtube text-2xl"></i>
          </div>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="font-semibold mb-4">{t("footer_menu_help")}</h3>
          <ul className="space-y-2 text-sm">
            <li>{t("footer_about_us")}</li>
            <li>{t("footer_contact")}</li>
            <li>{t("footer_faq")}</li>
            <li>{t("footer_posts")}</li>
            <li>{t("footer_jobs")}</li>
            <li>{t("footer_branches")}</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="font-semibold mb-4">{t("footer_products")}</h3>
          <ul className="space-y-2 text-sm">
            <li>{t("footer_all_products")}</li>
            <li>{t("footer_featured")}</li>
            <li>{t("footer_bestseller")}</li>
            <li>{t("footer_discounted")}</li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="font-semibold mb-4">{t("footer_contact")}</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-phone"></i> 2990
            </li>
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-envelope"></i> contact@mongolz.shop
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 mt-12 pt-6 text-center text-sm text-gray-400">
        ©2025 {t("footer_powered_by")}
        <span className="text-pink-500 font-bold px-2">ZOCHIL</span>
        {t("footer_platform")}
      </div>
    </footer>
  );
}
