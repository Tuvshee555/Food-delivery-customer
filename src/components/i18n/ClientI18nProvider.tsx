/* eslint-disable react-hooks/exhaustive-deps */
// src/components/i18n/ClientI18nProvider.tsx
"use client";

import React, { createContext, useContext, useMemo } from "react";

type Messages = Record<string, string>;

type I18nContextType = {
  locale: string;
  messages: Messages;
  t: (key: string, fallback?: string) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export default function ClientI18nProvider({
  locale,
  messages,
  children,
}: {
  locale: string;
  messages: Messages;
  children: React.ReactNode;
}) {
  // simple translator function
  const t = (key: string, fallback?: string) => {
    const v = messages?.[key];
    return v ?? fallback ?? key;
  };

  const value = useMemo(() => ({ locale, messages, t }), [locale, messages]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside ClientI18nProvider");
  return ctx;
}

/** convenience hooks */
export function useLocale() {
  return useI18n().locale;
}
export function useTranslations() {
  const { t } = useI18n();
  return (key: string, fallback?: string) => t(key, fallback);
}
