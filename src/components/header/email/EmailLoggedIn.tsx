"use client";

import { LogOut, User, Package, Ticket } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { handleLogout } from "./handlers/handleLogout";

interface EmailLoggedInProps {
  email: string;
  firstLetter: string;
  clearToken: () => void;
  closeSheet: () => void;
}

export const EmailLoggedIn = ({
  email,
  firstLetter,
  clearToken,
  closeSheet,
}: EmailLoggedInProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale, t } = useI18n();

  const activeTab = searchParams.get("tab");

  const navItem = (
    key: string,
    label: string,
    desc: string,
    icon: React.ReactNode,
    href: string
  ) => {
    const active = activeTab === key;

    return (
      <button
        onClick={() => {
          closeSheet(); // ✅ CLOSE SHEET
          router.push(href); // ✅ NAVIGATE
        }}
        className={`flex items-center gap-4 h-[56px] px-4 rounded-lg border transition
          ${
            active
              ? "bg-muted border-border"
              : "bg-card border-border hover:bg-muted"
          }`}
      >
        <div className="w-9 h-9 flex items-center justify-center rounded-md bg-muted">
          {icon}
        </div>

        <div className="flex flex-col justify-center text-left leading-tight">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-xs text-muted-foreground">{desc}</span>
        </div>
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col items-center pt-6 pb-5 border-b border-border">
        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-lg font-semibold">
          {firstLetter}
        </div>

        <p className="mt-3 text-sm text-muted-foreground truncate max-w-[220px]">
          {email}
        </p>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-3 px-5 py-5">
        {navItem(
          "profile",
          t("profile"),
          t("yourInfo"),
          <User className="w-5 h-5 text-muted-foreground" />,
          `/${locale}/profile?tab=profile`
        )}

        {navItem(
          "orders",
          t("orders"),
          t("yourOrders"),
          <Package className="w-5 h-5 text-muted-foreground" />,
          `/${locale}/profile?tab=orders`
        )}

        {navItem(
          "tickets",
          t("tickets"),
          t("yourTickets"),
          <Ticket className="w-5 h-5 text-muted-foreground" />,
          `/${locale}/profile?tab=tickets`
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Logout */}
      <div className="border-t border-border px-5 py-4">
        <button
          onClick={() => {
            closeSheet(); // ✅ CLOSE SHEET
            handleLogout(router, clearToken, locale);
          }}
          className="w-full h-[44px] rounded-md border border-destructive text-destructive text-sm font-medium flex items-center justify-center gap-2 hover:bg-destructive/5 transition"
        >
          <LogOut className="w-4 h-4" />
          {t("logout")}
        </button>
      </div>
    </div>
  );
};
