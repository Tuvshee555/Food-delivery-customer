"use client";

import { OrderDetails } from "../[orderId]/components/types";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

export function DeliveryInfo({ order }: { order: OrderDetails }) {
  const { t } = useI18n();
  const d = order.delivery;

  return (
    <div className="rounded-xl border bg-card p-5 space-y-3 text-sm">
      <h3 className="font-medium">{t("delivery_information")}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <p>
          {t("name")}: {d.lastName} {d.firstName}
        </p>
        <p>
          {t("phone")}: {d.phone}
        </p>
        <p>
          {t("city")}: {d.city}
        </p>
        <p>
          {t("district")}: {d.district}
        </p>
        <p>
          {t("khoroo")}: {d.khoroo}
        </p>
      </div>

      <p>
        {t("address")}: {d.address}
      </p>

      {d.notes && (
        <p>
          {t("notes")}: {d.notes}
        </p>
      )}
    </div>
  );
}
