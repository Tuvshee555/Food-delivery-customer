/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";
import { usePaymentPending } from "./components/usePaymentPending";

type Food = {
  id: string;
  foodName: string;
  image?: string | null;
  price: number;
};

type OrderItem = {
  id: string;
  food: Food;
  quantity: number;
};

type Delivery = {
  city?: string | null;
  district?: string | null;
  address?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
};

type Order = {
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

  const Spinner = () => (
    <motion.div
      aria-hidden
      className="w-10 h-10 rounded-full border-4 border-muted border-t-primary"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    />
  );

  if (!orderId) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">{t("order_invalid_url")}</p>
      </main>
    );
  }

  const formatCurrency = (n?: number | null) =>
    n == null ? "₮0" : `₮${n.toLocaleString()}`;

  return (
    <main className="min-h-screen pt-20 pb-28 bg-background">
      <div className="max-w-2xl mx-auto px-4 space-y-8">
        <section className="text-center space-y-2">
          <h1 className="text-2xl font-semibold leading-tight">
            {paid ? t("payment_success_title") : t("payment_waiting_title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("payment_waiting_subtitle")}
          </p>
        </section>

        <section className="bg-card rounded-2xl p-6 flex flex-col items-center gap-6 shadow-sm">
          {!paid ? (
            !qrText ? (
              <>
                <Spinner />
                <p className="text-sm text-muted-foreground">
                  {t("generating_qr")}
                </p>
              </>
            ) : (
              <>
                <div className="bg-white p-4 rounded-lg shadow-inner">
                  <QRCodeCanvas value={qrText} size={220} />
                </div>

                <p className="text-sm font-medium text-muted-foreground">
                  QPay
                </p>

                <a
                  href={`https://qpay.mn/q?q=${encodeURIComponent(qrText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center px-6 rounded-md bg-primary text-primary-foreground text-sm font-medium shadow-md"
                >
                  {t("pay_with_qpay")}
                </a>

                {status && (
                  <p className="text-xs text-muted-foreground">{status}</p>
                )}
              </>
            )
          ) : (
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="rounded-full border p-4 text-lg">✓</div>
              <p className="font-semibold">{t("payment_success")}</p>
            </motion.div>
          )}
        </section>

        {order && (
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
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : "-"}
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
                      <p className="font-medium leading-snug">
                        {item.food.foodName}
                      </p>
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
                  {order.delivery?.district
                    ? `, ${order.delivery?.district}`
                    : ""}
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
                <p className="text-muted-foreground">
                  {order.delivery?.phone ?? ""}
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
