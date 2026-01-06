"use client";

import Image from "next/image";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { OrderDetails } from "../[orderId]/types";

export function QPayPaymentBlock({ order }: { order: OrderDetails }) {
  const { t } = useI18n();

  if (order.status !== "WAITING_PAYMENT") return null;
  if (!order.qpay?.qrImage) return null;

  return (
    <div className="rounded-xl border bg-card p-5 space-y-4 text-center">
      <h3 className="text-sm font-semibold">{t("complete_payment")}</h3>

      <p className="text-xs text-muted-foreground">{t("scan_qpay_qr")}</p>

      <div className="mx-auto relative w-48 h-48">
        <Image
          src={order.qpay.qrImage}
          alt="QPay QR"
          fill
          className="object-contain"
          sizes="192px"
        />
      </div>

      <div className="text-sm font-medium">
        {t("amount")}: {order.totalPrice}₮
      </div>

      <p className="text-xs text-muted-foreground">{t("open_bank_app")}</p>
    </div>
  );
}
