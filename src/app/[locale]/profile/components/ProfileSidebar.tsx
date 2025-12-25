"use client";

import { LogOut, User, Package, Ticket, LayoutDashboard } from "lucide-react";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { Tab } from "../ProfileInner";

type Props = {
  email: string;
  activeTab: Tab;
  skeleton: boolean;
  onChangeTab: (tab: Tab) => void;
  onLogout: () => void;
};

export function ProfileSidebar({
  email,
  activeTab,
  skeleton,
  onChangeTab,
  onLogout,
}: Props) {
  const { t } = useI18n();
  const firstLetter = email ? email[0].toUpperCase() : "?";

  return (
    <aside
      className="
  hidden lg:block
  lg:w-[300px]
  bg-card border border-border rounded-2xl
  p-4 lg:p-6
  space-y-4
"
    >
      {/* PROFILE TOP */}
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold ${
            skeleton ? "animate-pulse bg-muted" : "bg-muted"
          }`}
        >
          {!skeleton && firstLetter}
        </div>

        <div className="flex-1 min-w-0">
          {skeleton ? (
            <div className="space-y-2">
              <div className="h-4 w-40 rounded-md bg-muted animate-pulse" />
              <div className="h-3 w-28 rounded-md bg-muted/60 animate-pulse" />
            </div>
          ) : (
            <p className="text-sm font-medium truncate">
              {email || t("no_email")}
            </p>
          )}
        </div>
      </div>

      {/* NAV */}
      <nav className="flex flex-col gap-2">
        {skeleton ? (
          <SkeletonNav />
        ) : (
          <>
            <NavItem
              active={activeTab === "dashboard"}
              icon={<LayoutDashboard className="w-5 h-5" />}
              label={t("profile_dashboard")}
              onClick={() => onChangeTab("dashboard")}
            />
            <NavItem
              active={activeTab === "profile"}
              icon={<User className="w-5 h-5" />}
              label={t("profile_personal")}
              onClick={() => onChangeTab("profile")}
            />
            <NavItem
              active={activeTab === "orders"}
              icon={<Package className="w-5 h-5" />}
              label={t("profile_orders")}
              onClick={() => onChangeTab("orders")}
            />
            <NavItem
              active={activeTab === "tickets"}
              icon={<Ticket className="w-5 h-5" />}
              label={t("profile_tickets")}
              onClick={() => onChangeTab("tickets")}
            />
          </>
        )}
      </nav>

      {/* LOGOUT */}
      <button
        onClick={onLogout}
        className="w-full h-[48px] rounded-md border border-destructive text-destructive text-sm font-medium flex items-center justify-center gap-2 hover:bg-destructive/5 transition"
      >
        <LogOut className="w-4 h-4" />
        {t("logout")}
      </button>
    </aside>
  );
}

/* ---------------- helpers ---------------- */

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-md h-[56px] px-5 transition ${
        active ? "bg-muted font-semibold" : "hover:bg-muted"
      }`}
    >
      <div className="w-9 h-9 flex items-center justify-center rounded-md bg-muted/60">
        {icon}
      </div>
      <span className="text-sm">{label}</span>
    </button>
  );
}

function SkeletonNav() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 h-[56px] px-5">
          <div className="w-9 h-9 rounded-md bg-muted animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-28 bg-muted animate-pulse rounded-md" />
            <div className="h-3 w-20 bg-muted/60 animate-pulse rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
