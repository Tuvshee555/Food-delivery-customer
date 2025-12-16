"use client";

import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";
import TranslateButton from "../translate/TranslateButton"; // adjust path if needed
import {
  useLocale,
  useTranslations,
} from "@/components/i18n/ClientI18nProvider";

export default function TopBar() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="w-full bg-white border-b border-black/10 text-[12px] text-neutral-600">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-8">
        <span className="font-medium tracking-wide">Тавтай морил</span>

        <div className="flex items-center gap-4">
          <NavLink href={`/${locale}/contact`} label={t("contact")} />
          <Divider />
          <NavLink href={`/${locale}/branches`} label={t("branches")} />
          <Divider />
          <NavLink href={`/${locale}/jobs`} label={t("jobs")} />
          <Divider />

          <div className="flex items-center gap-3 text-neutral-500">
            <Facebook className="hover:text-black transition" size={14} />
            <Instagram className="hover:text-black transition" size={14} />
            <Youtube className="hover:text-black transition" size={14} />
          </div>

          <Divider />
          <TranslateButton />
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return <span className="h-3 w-px bg-black/20" />;
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="hover:text-black transition whitespace-nowrap">
      {label}
    </Link>
  );
}
