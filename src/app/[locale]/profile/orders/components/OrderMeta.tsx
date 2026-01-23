"use client";

import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderDetails } from "../[orderId]/components/types";

export function OrderMeta({ order }: { order: OrderDetails }) {
  const { t } = useI18n();

  return (
    <div className="rounded-xl border bg-card p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
      <div>
        <p className="text-muted-foreground">{t("order_number")}</p>
        <p className="font-medium">{order.orderNumber}</p>
      </div>

      <div>
        <p className="text-muted-foreground">{t("status")}</p>
        <OrderStatusBadge status={order.status} />
      </div>

      <div>
        <p className="text-muted-foreground">{t("payment_method")}</p>
        <p className="font-medium">
          {order.paymentMethod
            ? t(`payment_method_${String(order.paymentMethod).toLowerCase()}`)
            : "-"}
        </p>
      </div>

      <div>
        <p className="text-muted-foreground">{t("created_at")}</p>
        <p className="font-medium">
          {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
