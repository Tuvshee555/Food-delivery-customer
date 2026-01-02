/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";
import { usePaymentPending } from "./components/usePaymentPending";

export default function PaymentPendingInner() {
  const Spinner = () => (
    <motion.div
      className="w-10 h-10 rounded-full border-4 border-muted border-t-primary"
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: 1,
        ease: "linear",
      }}
    />
  );

  const { t, orderId, order, qrText, paid, status, loadingOrder } =
    usePaymentPending();

  if (!orderId) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{t("order_invalid_url")}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-[80px] pb-24">
      <div className="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row gap-8">
        <section className="flex-1 bg-card rounded-2xl text-center space-y-6">
          <h2 className="text-lg font-semibold">
            {paid ? t("payment_success_title") : t("payment_waiting_title")}
          </h2>

          {!paid && (
            <div className="flex flex-col items-center gap-4">
              {!qrText ? (
                <>
                  <Spinner />
                  <p className="text-sm text-muted-foreground">
                    {t("generating_qr")}
                  </p>
                </>
              ) : (
                <>
                  <div className="bg-white p-4 rounded-xl">
                    <QRCodeCanvas value={qrText} size={240} />
                  </div>

                  <a
                    href={`https://qpay.mn/q?q=${encodeURIComponent(qrText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-[44px] px-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center"
                  >
                    {t("pay_with_qpay")}
                  </a>

                  <p className="text-sm text-muted-foreground">{status}</p>
                </>
              )}
            </div>
          )}

          {paid && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="rounded-full border p-4">✓</div>
              <p className="font-semibold">{t("payment_success")}</p>
            </motion.div>
          )}
        </section>

        <aside className="w-full lg:w-[380px] bg-card border rounded-2xl p-6">
          <h3 className="font-semibold border-b pb-2">{t("order_details")}</h3>

          {!order?.items?.length ? (
            <p className="text-sm text-muted-foreground mt-4">
              {loadingOrder ? t("loading") : t("order_not_found")}
            </p>
          ) : (
            <div className="space-y-4 mt-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <img
                    src={item.food.image}
                    className="w-14 h-14 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.food.foodName}</p>
                    <p className="text-xs text-muted-foreground">
                      {t("quantity")}: {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-medium">
                    ₮{(item.food.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
