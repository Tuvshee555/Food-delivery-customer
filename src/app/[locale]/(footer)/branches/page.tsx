"use client";

import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { MapPin, Truck, Store } from "lucide-react";

export default function BranchesPage() {
  const { t } = useI18n();

  return (
    <section className="max-w-5xl mx-auto px-6 py-16 space-y-12">
      <h1 className="text-3xl font-bold text-center">{t("branches_title")}</h1>

      {/* Main location */}
      <div className="border rounded-lg p-6 flex gap-4">
        <MapPin className="mt-1" />
        <div>
          <h2 className="font-semibold text-lg">{t("branches_main_title")}</h2>
          <p className="text-gray-600">{t("branches_main_address")}</p>
        </div>
      </div>

      {/* Online store */}
      <div className="border rounded-lg p-6 flex gap-4">
        <Store className="mt-1" />
        <div>
          <h2 className="font-semibold text-lg">
            {t("branches_online_title")}
          </h2>
          <p className="text-gray-600">{t("branches_online_desc")}</p>
        </div>
      </div>

      {/* Delivery */}
      <div className="border rounded-lg p-6 flex gap-4">
        <Truck className="mt-1" />
        <div>
          <h2 className="font-semibold text-lg">
            {t("branches_delivery_title")}
          </h2>
          <p className="text-gray-600">{t("branches_delivery_desc")}</p>
        </div>
      </div>
    </section>
  );
}
