"use client";

import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { Ticket } from "lucide-react"; // Optional icon

export const TicketsList = () => {
  const { t } = useI18n();

  return (
    <div className="bg-[#0a0a0a] text-white p-6 rounded-2xl border border-gray-800 shadow-[0_0_20px_rgba(250,204,21,0.05)]">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Ticket className="text-[#facc15]" />
        {t("my_tickets")}
      </h1>

      <p className="text-gray-400 text-sm mb-6">{t("no_tickets_text")}</p>

      {/* 🔹 Placeholder list item styling for future tickets */}
      <div className="border border-gray-800 rounded-xl p-6 text-center text-gray-500 text-sm">
        {t("tickets_coming_soon")}
      </div>
    </div>
  );
};
