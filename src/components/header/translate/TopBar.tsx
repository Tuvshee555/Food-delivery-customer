"use client";

import TranslateButton from "../translate/TranslateButton";
import ThemeToggle from "@/components/theme/ThemeToggle";
import {
  useTranslations,
} from "@/components/i18n/ClientI18nProvider";

export default function TopBar() {
  const t = useTranslations();

  return (
    <div className="w-full bg-primary text-primary-foreground text-[12px]">
      <div className="max-w-7xl mx-auto relative flex items-center justify-center px-4 h-9">
        <span className="font-medium tracking-wider uppercase text-center hidden sm:inline">
          🚚 {t("free_shipping_announcement")} &nbsp;·&nbsp; {t("new_arrivals_announcement")}
        </span>
        <span className="font-medium tracking-wider uppercase text-center sm:hidden text-[11px]">
          🚚 {t("free_shipping_announcement")}
        </span>
        <div className="absolute right-4 flex items-center gap-3">
          <TranslateButton />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
