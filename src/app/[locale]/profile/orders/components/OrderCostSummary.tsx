"use client";

import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { OrderDetails } from "../[orderId]/components/types";

export function OrderCostSummary({ order }: { order: OrderDetails }) {
  const { t } = useI18n();

  const itemsTotal = order.items.reduce((sum, item) => {
    const price = item.food.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  const deliveryFee =
    typeof order.deliveryFee === "number" ? order.deliveryFee : 0;

  const grandTotal =
    typeof order.totalPrice === "number"
      ? order.totalPrice
      : itemsTotal + deliveryFee;

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-5 space-y-3 text-sm">
      <h3 className="font-semibold">{t("payment_summary")}</h3>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t("products_total")}</span>
          <span>{itemsTotal}₮</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">{t("delivery_fee")}</span>
          <span>{deliveryFee}₮</span>
        </div>

        <div className="border-t pt-2 flex justify-between font-semibold text-base">
          <span>{t("total")}</span>
          <span>{grandTotal}₮</span>
        </div>
      </div>
    </div>
  );
}
