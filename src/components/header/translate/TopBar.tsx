/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";
import TranslateButton from "../translate/TranslateButton";
import ThemeToggle from "@/components/theme/ThemeToggle";
import {
  useLocale,
  useTranslations,
} from "@/components/i18n/ClientI18nProvider";

export default function TopBar() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="w-full bg-background border-b border-border text-[12px]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-8 md:h-9">
        <span className="font-medium tracking-wide text-foreground hidden md:inline">
          {t("welcome")}
        </span>

        <div className="flex items-center gap-4">
          {/* <NavLink href={`/${locale}/contact`} label={t("contact")} />
          <Divider />
          <NavLink href={`/${locale}/branches`} label={t("branches")} />
          <Divider />
          <NavLink href={`/${locale}/jobs`} label={t("jobs")} />
          <Divider /> */}

          <div className="flex items-center gap-3 text-foreground">
            <Facebook className="hover:opacity-80 transition" size={14} />
            <Instagram className="hover:opacity-80 transition" size={14} />
            <Youtube className="hover:opacity-80 transition" size={14} />
          </div>

          <Divider />

          <TranslateButton />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return <span className="h-3 w-px bg-border opacity-60" />;
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="whitespace-nowrap px-2 py-1 text-foreground hover:opacity-80 transition"
    >
      {label}
    </Link>
  );
}
