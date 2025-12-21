"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, Package, Ticket, LayoutDashboard } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ProfileInfo } from "./profile/ProfileInfo";
import { OrdersList } from "./profile/OrdersList";
import { TicketsList } from "./profile/TicketsList";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import Header from "@/components/header/Header";

/* ---------------- types ---------------- */
type Tab = "dashboard" | "profile" | "orders" | "tickets";

/* ---------------- component ---------------- */
export default function ProfileInner() {
  const { locale, t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState<string>("");
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  // tiny skeleton on mount to avoid layout jump (matches Mongolz loading feel)
  const [skeleton, setSkeleton] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setSkeleton(false), 200);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    setEmail(localStorage.getItem("email") ?? "");

    const tab = searchParams.get("tab") as Tab | null;
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const firstLetter = email ? email[0].toUpperCase() : "?";

  const changeTab = (tab: Tab) => {
    setActiveTab(tab);
    router.replace(`/${locale}/profile?tab=${tab}`);
  };

  const logout = () => {
    localStorage.clear();
    toast.success(t("logout_success"));
    router.push(`/${locale}`);
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background text-foreground pt-[120px] pb-20">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* SIDEBAR */}
          <aside className="w-full lg:w-[300px] bg-card border border-border rounded-2xl p-4 lg:p-6 space-y-4">
            {/* PROFILE TOP */}
            <div className="flex items-center gap-4">
              {/* avatar */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold ${
                  skeleton ? "animate-pulse bg-muted" : "bg-muted"
                }`}
                aria-hidden
              >
                {!skeleton && firstLetter}
              </div>

              {/* email or skeleton */}
              <div className="flex-1 min-w-0">
                {skeleton ? (
                  <div className="space-y-2">
                    <div className="h-4 w-40 rounded-md bg-muted animate-pulse" />
                    <div className="h-3 w-28 rounded-md bg-muted/60 animate-pulse" />
                  </div>
                ) : (
                  <p className="text-sm font-medium truncate text-foreground">
                    {email || t("no_email")}
                  </p>
                )}
              </div>
            </div>

            {/* NAV */}
            <nav className="flex flex-col gap-2 mt-2">
              {skeleton ? (
                <SkeletonNav />
              ) : (
                <>
                  <NavItem
                    active={activeTab === "dashboard"}
                    icon={<LayoutDashboard className="w-5 h-5" />}
                    label={t("profile_dashboard")}
                    onClick={() => changeTab("dashboard")}
                    paddingClass="h-[56px] px-5"
                  />

                  <NavItem
                    active={activeTab === "profile"}
                    icon={<User className="w-5 h-5" />}
                    label={t("profile_personal")}
                    onClick={() => changeTab("profile")}
                    paddingClass="h-[56px] px-5"
                  />

                  <NavItem
                    active={activeTab === "orders"}
                    icon={<Package className="w-5 h-5" />}
                    label={t("profile_orders")}
                    onClick={() => changeTab("orders")}
                    paddingClass="h-[56px] px-5"
                  />

                  <NavItem
                    active={activeTab === "tickets"}
                    icon={<Ticket className="w-5 h-5" />}
                    label={t("profile_tickets")}
                    onClick={() => changeTab("tickets")}
                    paddingClass="h-[56px] px-5"
                  />
                </>
              )}
            </nav>

            {/* footer area in sidebar (logout) */}
            <div className="mt-3">
              <button
                onClick={logout}
                className="w-full h-[48px] rounded-md border border-destructive text-destructive text-sm font-medium flex items-center justify-center gap-2 hover:bg-destructive/5 transition"
              >
                <LogOut className="w-4 h-4" />
                {t("logout")}
              </button>
            </div>
          </aside>

          {/* CONTENT */}
          <section className="flex-1">
            <div className="bg-card border border-border rounded-2xl p-5 lg:p-6">
              <AnimatePresence mode="wait">
                {activeTab === "dashboard" && (
                  <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                  >
                    <h2 className="text-base font-semibold mb-4">
                      {t("profile_dashboard")}
                    </h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <DashboardCard
                        icon={<User className="w-5 h-5" />}
                        title={t("profile_personal")}
                        desc={t("profile_edit_desc")}
                        onClick={() => changeTab("profile")}
                      />
                      <DashboardCard
                        icon={<Package className="w-5 h-5" />}
                        title={t("profile_orders")}
                        desc={t("profile_orders_desc")}
                        onClick={() => changeTab("orders")}
                      />
                      <DashboardCard
                        icon={<Ticket className="w-5 h-5" />}
                        title={t("profile_tickets")}
                        desc={t("profile_tickets_desc")}
                        onClick={() => changeTab("tickets")}
                      />
                    </div>
                  </motion.div>
                )}

                {activeTab === "profile" && (
                  <MotionWrap key="profile">
                    <ProfileInfo />
                  </MotionWrap>
                )}

                {activeTab === "orders" && (
                  <MotionWrap key="orders">
                    <OrdersList />
                  </MotionWrap>
                )}

                {activeTab === "tickets" && (
                  <MotionWrap key="tickets">
                    <TicketsList />
                  </MotionWrap>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

/* ---------------- NavItem ---------------- */
function NavItem({
  icon,
  label,
  active,
  onClick,
  paddingClass = "h-[56px] px-5",
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  paddingClass?: string;
}) {
  // active: slightly stronger background, bold label — calm emphasis similar to Mongolz
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-md w-full transition ${paddingClass}
        ${active ? "bg-muted font-semibold" : "hover:bg-muted"}`}
      aria-current={active ? "true" : undefined}
    >
      <div
        className={`w-9 h-9 flex items-center justify-center rounded-md ${
          active ? "bg-muted/80" : "bg-muted/60"
        }`}
      >
        <span className="text-muted-foreground">{icon}</span>
      </div>

      <span className="text-sm text-foreground">{label}</span>
    </button>
  );
}

/* ---------------- DashboardCard ---------------- */
function DashboardCard({
  icon,
  title,
  desc,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left p-4 rounded-xl border border-border bg-card hover:bg-muted transition space-y-1"
    >
      <div className="w-9 h-9 rounded-md flex items-center justify-center bg-muted text-muted-foreground mb-1">
        {icon}
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </button>
  );
}

/* ---------------- MotionWrap ---------------- */
function MotionWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.16 }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- SkeletonNav ---------------- */
function SkeletonNav() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-md h-[56px] px-5"
        >
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
