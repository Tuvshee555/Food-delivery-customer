/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import axios from "axios";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

type OrderItem = {
  quantity: number;
  food: {
    foodName: string;
    price: number;
    image: string;
  };
};

type OrderData = {
  id?: string;
  totalPrice?: number;
  deliveryFee?: number;
  productTotal?: number;
  items?: OrderItem[];
};

export default function PaymentPendingInner() {
  const { t } = useI18n();
  const searchParams = useSearchParams();

  const [orderId, setOrderId] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderData | null>(null);

  const [qrText, setQrText] = useState<string | null>(null);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);
  const [status, setStatus] = useState(t("payment_creating"));

  const hasRequestedInvoice = useRef(false);

  /* ---------------- resolve orderId ---------------- */

  useEffect(() => {
    const fromUrl = searchParams.get("orderId");
    if (fromUrl) {
      setOrderId(fromUrl);
      localStorage.setItem("lastOrderId", fromUrl);
      return;
    }

    const fromStorage = localStorage.getItem("lastOrderId");
    if (fromStorage) {
      setOrderId(fromStorage);
    }
  }, [searchParams]);

  /* ---------------- fetch order ---------------- */

  useEffect(() => {
    if (!orderId) return;

    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order/${orderId}`)
      .then((res) => setOrder(res.data.order ?? res.data))
      .catch(() => toast.error(t("order_not_found")));
  }, [orderId, t]);

  /* ---------------- create QPay invoice ---------------- */

  useEffect(() => {
    if (!orderId || !order?.totalPrice) return;
    if (hasRequestedInvoice.current) return;

    hasRequestedInvoice.current = true;

    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/qpay/create`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId,
              amount: order.totalPrice,
            }),
          }
        );

        const data = await res.json();

        if (!data.qr_text) {
          toast.error(t("payment_qr_error"));
          return;
        }

        setQrText(data.qr_text);
        setInvoiceId(data.invoice_id);
        setStatus(t("payment_waiting"));
      } catch {
        toast.error(t("payment_create_fail"));
      }
    })();
  }, [order, orderId, t]);

  /* ---------------- poll payment ---------------- */

  useEffect(() => {
    if (!invoiceId || paid) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/qpay/check`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ invoiceId }),
          }
        );

        const data = await res.json();

        if (data.paid) {
          setPaid(true);
          setStatus(t("payment_success"));
          clearInterval(interval);
        }
      } catch {
        /* silent */
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [invoiceId, paid, t]);

  /* ---------------- guard ---------------- */

  if (!orderId) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">{t("order_invalid_url")}</p>
      </main>
    );
  }

  /* ---------------- render ---------------- */

  return (
    <main className="min-h-screen bg-background text-foreground pt-[120px] pb-24">
      <div className="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row gap-8">
        {/* QR SECTION */}
        <section className="flex-1 bg-card border border-border rounded-2xl p-6 text-center space-y-6">
          <h2 className="text-lg font-semibold">
            {paid ? t("payment_success_title") : t("payment_waiting_title")}
          </h2>

          <p className="text-sm text-muted-foreground">
            {t("payment_confirm_message")}
          </p>

          {!paid && qrText && (
            <div className="flex flex-col items-center gap-4">
              {/* ✅ QR WHITE ISLAND (INTENTIONAL) */}
              <div className="bg-white p-4 rounded-xl">
                <QRCodeCanvas value={qrText} size={240} />
              </div>

              <a
                href={`https://qpay.mn/q?q=${encodeURIComponent(qrText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-[44px] px-6 rounded-md bg-primary text-primary-foreground text-sm font-medium flex items-center"
              >
                {t("pay_with_qpay")}
              </a>

              <p className="text-sm text-muted-foreground">{status}</p>
            </div>
          )}

          {paid && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="rounded-full border border-border p-4">✓</div>
              <p className="font-semibold">{t("payment_success")}</p>
            </motion.div>
          )}
        </section>

        {/* ORDER SUMMARY */}
        {order?.items?.length && (
          <aside className="w-full lg:w-[380px] bg-card border border-border rounded-2xl p-6 space-y-6">
            <h3 className="text-base font-semibold border-b border-border pb-2">
              {t("order_details")}
            </h3>

            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <img
                    src={item.food.image}
                    alt={item.food.foodName}
                    className="w-14 h-14 rounded-md object-cover border border-border"
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

            <div className="border-t border-border" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t("products")}</span>
                <span>₮{(order.productTotal ?? 0).toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>{t("delivery")}</span>
                <span>₮{(order.deliveryFee ?? 0).toLocaleString()}</span>
              </div>

              <div className="flex justify-between font-semibold pt-2">
                <span>{t("grand_total")}</span>
                <span>₮{(order.totalPrice ?? 0).toLocaleString()}</span>
              </div>
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}
