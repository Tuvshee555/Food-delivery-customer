"use client";

import React from "react";
import { usePaymentPending } from "./components/usePaymentPending";
import { PaymentStatusCard } from "./components/PaymentStatusCard";
import { OrderDetailsCard } from "./components/OrderDetailsCard";

export type Food = {
  id: string;
  foodName: string;
  image?: string | null;
  price: number;
};

export type OrderItem = {
  id: string;
  food: Food;
  quantity: number;
};

export type Delivery = {
  city?: string | null;
  district?: string | null;
  address?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
};

export type Order = {
  orderNumber?: string | number | null;
  createdAt?: string | null;
  totalPrice?: number | null;
  items?: OrderItem[] | null;
  delivery?: Delivery | null;
};

export default function PaymentPendingInner() {
  const { t, orderId, order, qrText, paid, status } =
    usePaymentPending() as unknown as {
      t: (k: string) => string;
      orderId?: string | null;
      order?: Order | null;
      qrText?: string | null;
      paid?: boolean;
      status?: string | null;
    };

  if (!orderId) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">{t("order_invalid_url")}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-20 pb-28 bg-background">
      <div className="mx-auto px-4 space-y-8 flex justify-center items-center gap-[150px]">
        <div>
          <section className="text-center space-y-2">
            <h1 className="text-2xl font-semibold leading-tight">
              {paid ? t("payment_success_title") : t("payment_waiting_title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("payment_waiting_subtitle")}
            </p>
          </section>

          <PaymentStatusCard
            t={t}
            qrText={qrText}
            paid={paid}
            status={status}
          />
        </div>

        {order && <OrderDetailsCard t={t} order={order} />}
      </div>
    </main>
  );
}
