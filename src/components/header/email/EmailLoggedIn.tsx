"use client";

import { LogOut, User, Package, Ticket } from "lucide-react";
import { handleLogout } from "./handlers/handleLogout";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

export const EmailLoggedIn = ({
  email,
  firstLetter,
  clearToken,
}: {
  email: string;
  firstLetter: string;
  clearToken: () => void;
}) => {
  const router = useRouter();
  const { locale, t } = useI18n();

  return (
    <>
      <div className="flex flex-col items-center pt-8 pb-6 border-b border-gray-800">
        <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-semibold text-[#facc15]">
          {firstLetter}
        </div>
        <h2 className="mt-3 font-medium text-gray-300 text-sm">{email}</h2>
      </div>

      <div className="flex flex-col px-6 py-5 gap-4">
        <button
          onClick={() => router.push(`/${locale}/profile?tab=profile`)}
          className="flex items-start gap-3 p-4 rounded-xl bg-[#111]/90 border border-gray-800 hover:border-[#facc15]"
        >
          <User className="w-5 h-5 text-[#facc15]" />
          <div>
            <p className="font-semibold">{t("profile")}</p>
            <p className="text-gray-400 text-sm">{t("yourInfo")}</p>
          </div>
        </button>

        <button
          onClick={() => router.push(`/${locale}/profile?tab=orders`)}
          className="flex items-start gap-3 p-4 rounded-xl bg-[#111]/90 border border-gray-800 hover:border-[#facc15]"
        >
          <Package className="w-5 h-5 text-[#facc15]" />
          <div>
            <p className="font-semibold">{t("orders")}</p>
            <p className="text-gray-400 text-sm">{t("yourOrders")}</p>
          </div>
        </button>

        <button
          onClick={() => router.push(`/${locale}/profile?tab=tickets`)}
          className="flex items-start gap-3 p-4 rounded-xl bg-[#111]/90 border border-gray-800 hover:border-[#facc15]"
        >
          <Ticket className="w-5 h-5 text-[#facc15]" />
          <div>
            <p className="font-semibold">{t("tickets")}</p>
            <p className="text-gray-400 text-sm">{t("yourTickets")}</p>
          </div>
        </button>
      </div>

      <div className="border-t border-gray-800 p-5 bg-[#111]/80">
        <button
          onClick={() => handleLogout(router, clearToken, locale)}
          className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" /> {t("logout")}
        </button>
      </div>
    </>
  );
};
