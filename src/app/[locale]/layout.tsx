/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import ClientI18nProvider from "@/components/i18n/ClientI18nProvider";
import QueryProvider from "./QueryProvider";
import { AuthProvider } from "./provider/AuthProvider";
import { FoodDataProvider } from "./provider/FoodDataProvider";
import { CategoryProvider } from "./provider/CategoryProvider";

import HeaderClient from "@/components/header/HeaderClient";
import Footer from "@/components/footer/Footer";

type Props = {
  children: ReactNode;
  params: any;
};

export function generateStaticParams() {
  return [{ locale: "mn" }, { locale: "en" }, { locale: "ko" }];
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = (await params) as { locale: string };

  if (!locale) return notFound();

  let messages: Record<string, string>;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    return notFound();
  }

  return (
    <QueryProvider>
      <ClientI18nProvider locale={locale} messages={messages}>
        <AuthProvider>
          <FoodDataProvider>
            <CategoryProvider>
              <HeaderClient />
              {children}
              <Footer />
            </CategoryProvider>
          </FoodDataProvider>
        </AuthProvider>
      </ClientI18nProvider>
    </QueryProvider>
  );
}
