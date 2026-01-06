"use client";

import clsx from "clsx";
import { OrderDetails } from "../[orderId]/types";

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  WAITING_PAYMENT: "bg-orange-100 text-orange-700",
  PAID: "bg-green-100 text-green-700",
  DELIVERING: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export function OrderStatusBadge({
  status,
}: {
  status: OrderDetails["status"];
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        STATUS_STYLE[status] ?? "bg-muted text-muted-foreground"
      )}
    >
      {status}
    </span>
  );
}
