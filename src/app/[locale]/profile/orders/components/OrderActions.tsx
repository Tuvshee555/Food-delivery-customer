"use client";

import { toast } from "sonner";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { OrderDetails } from "../[orderId]/types";

export function OrderActions({
  order,
  onUpdated,
  token,
}: {
  order: OrderDetails;
  token: string;
  onUpdated: () => void;
}) {
  const { t } = useI18n();

  const canCancel =
    order.status === "PENDING" || order.status === "WAITING_PAYMENT";

  const canRetryPayment = order.status === "WAITING_PAYMENT";

  const cancelOrder = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/${order.id}/cancel`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error();
      toast.success(t("order_cancelled"));
      onUpdated();
    } catch {
      toast.error(t("action_failed"));
    }
  };

  const retryPayment = () => {
    window.location.href = `/${order.id}/payment`;
  };

  if (!canCancel && !canRetryPayment) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {canRetryPayment && (
        <button
          onClick={retryPayment}
          className="h-11 rounded-lg bg-primary text-primary-foreground px-4 text-sm font-medium"
        >
          {t("retry_payment")}
        </button>
      )}

      {canCancel && (
        <button
          onClick={cancelOrder}
          className="h-11 rounded-lg border border-destructive text-destructive px-4 text-sm font-medium"
        >
          {t("cancel_order")}
        </button>
      )}
    </div>
  );
}
