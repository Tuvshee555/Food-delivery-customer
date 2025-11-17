"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, Package, Ticket, LayoutDashboard } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { OrdersList } from "@/components/profile/OrdersList";
import { TicketsList } from "@/components/profile/TicketsList";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { Header } from "@/components/header/Header";

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "profile" | "orders" | "tickets"
  >("dashboard");

  // Load email + detect ?tab=
  useEffect(() => {
    const email = localStorage.getItem("email");
    setUserEmail(email);

    const tab = searchParams.get("tab");
    if (
      tab === "dashboard" ||
      tab === "orders" ||
      tab === "tickets" ||
      tab === "profile"
    ) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const firstLetter = userEmail ? userEmail.charAt(0).toUpperCase() : "?";

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("✅ Системээс гарлаа");
    router.push("/home-page");
  };

  // Update URL + state
  const handleTabChange = (
    tab: "dashboard" | "profile" | "orders" | "tickets"
  ) => {
    setActiveTab(tab);
    router.replace(`/profile?tab=${tab}`);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0a0a0a] text-white pt-[120px] px-4 md:px-10 pb-20">
        <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row gap-10">
          {/* Sidebar */}
          <aside className="w-full md:w-[300px] bg-[#0e0e0e]/90 border border-gray-800 rounded-2xl p-6 flex flex-col items-center text-center gap-6 shadow-[0_0_30px_-10px_rgba(250,204,21,0.1)]">
            <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-semibold text-[#facc15]">
              {firstLetter}
            </div>
            <p className="text-sm text-gray-400">{userEmail}</p>

            <nav className="w-full flex flex-col text-left gap-2">
              <button
                onClick={() => handleTabChange("dashboard")}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl transition ${
                  activeTab === "dashboard"
                    ? "bg-[#1a1a1a] border border-gray-700 text-white"
                    : "text-gray-300 hover:text-[#facc15]"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-[#facc15]" /> Хянах
                самбар
              </button>

              <button
                onClick={() => handleTabChange("profile")}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl transition ${
                  activeTab === "profile"
                    ? "bg-[#1a1a1a] border border-gray-700 text-white"
                    : "text-gray-300 hover:text-[#facc15]"
                }`}
              >
                <User className="w-4 h-4 text-[#facc15]" /> Профайл
              </button>

              <button
                onClick={() => handleTabChange("orders")}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl transition ${
                  activeTab === "orders"
                    ? "bg-[#1a1a1a] border border-gray-700 text-white"
                    : "text-gray-300 hover:text-[#facc15]"
                }`}
              >
                <Package className="w-4 h-4 text-[#facc15]" /> Захиалгууд
              </button>

              <button
                onClick={() => handleTabChange("tickets")}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl transition ${
                  activeTab === "tickets"
                    ? "bg-[#1a1a1a] border border-gray-700 text-white"
                    : "text-gray-300 hover:text-[#facc15]"
                }`}
              >
                <Ticket className="w-4 h-4 text-[#facc15]" /> Миний тасалбар
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:text-red-500 transition mt-4 border-t border-gray-800 pt-4"
              >
                <LogOut className="w-4 h-4 text-red-500" /> Системээс гарах
              </button>
            </nav>
          </aside>

          {/* Main content */}
          <section className="flex-1 bg-[#0e0e0e]/90 border border-gray-800 rounded-2xl p-8 shadow-[0_0_40px_-10px_rgba(250,204,21,0.1)]">
            <AnimatePresence mode="wait">
              {/* Dashboard */}
              {activeTab === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-2xl font-bold mb-8">Хянах самбар</h1>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <button
                      onClick={() => handleTabChange("profile")}
                      className="flex flex-col items-start p-6 rounded-2xl bg-[#111]/90 border border-gray-800 hover:border-[#facc15] transition"
                    >
                      <User className="w-6 h-6 text-[#facc15] mb-3" />
                      <h3 className="text-lg font-semibold text-white">
                        Профайл
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">
                        Овог нэр, утас болон хүргэлтийн хаяг солих
                      </p>
                    </button>

                    <button
                      onClick={() => handleTabChange("orders")}
                      className="flex flex-col items-start p-6 rounded-2xl bg-[#111]/90 border border-gray-800 hover:border-[#facc15] transition"
                    >
                      <Package className="w-6 h-6 text-[#facc15] mb-3" />
                      <h3 className="text-lg font-semibold text-white">
                        Захиалгууд
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">
                        Захиалгын түүх харах, захиалгаа хянах
                      </p>
                    </button>

                    <button
                      onClick={() => handleTabChange("tickets")}
                      className="flex flex-col items-start p-6 rounded-2xl bg-[#111]/90 border border-gray-800 hover:border-[#facc15] transition"
                    >
                      <Ticket className="w-6 h-6 text-[#facc15] mb-3" />
                      <h3 className="text-lg font-semibold text-white">
                        Миний тасалбар
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">
                        Худалдан авсан тасалбараа харах, ашиглах
                      </p>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Profile */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProfileInfo />
                </motion.div>
              )}

              {/* Orders */}
              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <OrdersList />
                </motion.div>
              )}

              {/* Tickets */}
              {activeTab === "tickets" && (
                <motion.div
                  key="tickets"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TicketsList />
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>
    </>
  );
}
