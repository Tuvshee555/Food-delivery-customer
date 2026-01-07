/* eslint-disable @next/next/no-img-element */
"use client";

import { Order } from "../PaymentPendingInner";

export function OrderDetailsCard({
  t,
  order,
}: {
  t: (k: string) => string;
  order: Order;
}) {
  const formatCurrency = (n?: number | null) =>
    n == null ? "₮0" : `₮${n.toLocaleString()}`;

  return (
    <section className="bg-card border rounded-2xl p-6 space-y-6">
      <h3 className="font-semibold text-base">{t("order_details")}</h3>

      <div className="border rounded-xl p-4 text-sm space-y-3">
        <div className="flex justify-between text-muted-foreground">
          <span>{t("order_number")}</span>
          <span className="font-medium text-foreground">
            #{order.orderNumber}
          </span>
        </div>

        <div className="flex justify-between text-muted-foreground">
          <span>{t("order_date")}</span>
          <span className="text-foreground">
            {order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}
          </span>
        </div>

        <div className="flex justify-between text-muted-foreground">
          <span>{t("product_total")}</span>
          <span className="text-foreground">
            {formatCurrency(order.totalPrice)}
          </span>
        </div>

        <div className="flex justify-between text-muted-foreground">
          <span>{t("delivery_fee")}</span>
          <span className="text-foreground">₮0</span>
        </div>

        <div className="border-t pt-3 flex justify-between font-semibold text-base">
          <span>{t("total")}</span>
          <span>{formatCurrency(order.totalPrice)}</span>
        </div>
      </div>

      <div className="border rounded-xl divide-y">
        {(order.items ?? []).map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 gap-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.food.image ?? "/placeholder.png"}
                alt={item.food.foodName}
                className="w-14 h-14 rounded-md object-cover"
              />
              <div>
                <p className="font-medium leading-snug">{item.food.foodName}</p>
                <p className="text-sm text-muted-foreground">
                  {t("quantity")}: {item.quantity}
                </p>
              </div>
            </div>

            <p className="font-medium">
              {formatCurrency(item.food.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="border rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div>
          <p className="font-medium mb-1">{t("delivery_address")}</p>
          <p className="text-muted-foreground">
            {order.delivery?.city ?? ""}
            {order.delivery?.district ? `, ${order.delivery?.district}` : ""}
            <br />
            {order.delivery?.address ?? ""}
          </p>
        </div>

        <div>
          <p className="font-medium mb-1">{t("full_name")}</p>
          <p className="text-muted-foreground">
            {order.delivery
              ? `${order.delivery.lastName ?? ""} ${
                  order.delivery.firstName ?? ""
                }`
              : ""}
          </p>
        </div>

        <div>
          <p className="font-medium mb-1">{t("phone_number")}</p>
          <p className="text-muted-foreground">{order.delivery?.phone ?? ""}</p>
        </div>
      </div>
    </section>
  );
}
