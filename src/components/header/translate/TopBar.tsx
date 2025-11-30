"use client";

import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";
import TranslateButton from "./TranslateButton";
import {
  useLocale,
  useTranslations,
} from "@/components/i18n/ClientI18nProvider";

export default function TopBar() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="w-full bg-[#0c0c0c] border-b border-gray-800 text-white text-[13px] select-none z-[99999]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-10 py-1.5">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Link
            className="hover:text-amber-400 transition"
            href={`/${locale}/contact`}
          >
            {t("contact")}
          </Link>
          <Link
            className="hover:text-amber-400 transition"
            href={`/${locale}/branches`}
          >
            {t("branches")}
          </Link>
          <Link
            className="hover:text-amber-400 transition"
            href={`/${locale}/jobs`}
          >
            {t("jobs")}
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <TranslateButton />

          <div className="hidden sm:flex items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-400 transition"
            >
              <Facebook size={16} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-400 transition"
            >
              <Instagram size={16} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-400 transition"
            >
              <Youtube size={18} />
            </a>
          </div>

          <Link
            href={`/${locale}/auth`}
            className="hover:text-amber-400 transition hidden sm:block"
          >
            {t("login")}
          </Link>
        </div>
      </div>
    </div>
  );
}
