/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
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
  const router = useRouter();

  const [orderId, setOrderId] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderData | null>(null);

  const [qrText, setQrText] = useState<string | null>(null);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);
  const [status, setStatus] = useState<string>(t("payment_creating"));
  const [loadingOrder, setLoadingOrder] = useState(false);

  const hasRequestedInvoice = useRef(false);
  const pollRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  // read token if present (optional)
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    mountedRef.current = true;
    try {
      const t = localStorage.getItem("token");
      if (t) setToken(t);
    } catch {
      setToken(null);
    }
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /* ---------------- resolve orderId ---------------- */
  useEffect(() => {
    const fromUrl = searchParams.get("orderId");
    if (fromUrl) {
      setOrderId(fromUrl);
      try {
        localStorage.setItem("lastOrderId", fromUrl);
      } catch {
        // ignore
      }
      return;
    }

    try {
      const fromStorage = localStorage.getItem("lastOrderId");
      if (fromStorage) setOrderId(fromStorage);
    } catch {
      /* ignore */
    }
  }, [searchParams]);

  /* ---------------- fetch order ---------------- */
  const fetchOrder = async (id: string) => {
    setLoadingOrder(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/${id}`,
        { headers }
      );
      const payload = res.data?.order ?? res.data;
      if (mountedRef.current) {
        setOrder(payload ?? null);
      }
    } catch (err) {
      console.error("fetchOrder error", err);
      if (mountedRef.current) {
        toast.error(t("order_not_found"));
        setOrder(null);
      }
    } finally {
      if (mountedRef.current) setLoadingOrder(false);
    }
  };

  useEffect(() => {
    if (!orderId) return;
    fetchOrder(orderId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, token]);

  /* ---------------- create QPay invoice ---------------- */
  useEffect(() => {
    if (!orderId || !order?.totalPrice) return;
    if (hasRequestedInvoice.current) return;

    hasRequestedInvoice.current = true;

    (async () => {
      try {
        const headers = { "Content-Type": "application/json" } as any;
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/qpay/create`,
          { orderId, amount: order.totalPrice },
          { headers }
        );

        const data = res.data ?? {};

        if (!data.qr_text) {
          toast.error(t("payment_qr_error"));
          return;
        }

        if (mountedRef.current) {
          setQrText(data.qr_text);
          setInvoiceId(data.invoice_id ?? data.invoiceId ?? null);
          setStatus(t("payment_waiting"));
        }
      } catch (err) {
        console.error("qpay create error", err);
        toast.error(t("payment_create_fail"));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, orderId, token]);

  /* ---------------- poll payment ---------------- */
  useEffect(() => {
    // start polling only when we have invoiceId and not paid
    if (!invoiceId || paid) return;

    const checkOnce = async () => {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/qpay/check`,
          { invoiceId },
          { headers: { "Content-Type": "application/json" } }
        );
        return res.data ?? {};
      } catch (err) {
        // keep silent, but log for debugging
        console.error("qpay check error", err);
        return null;
      }
    };

    // poll immediately, then set interval
    (async () => {
      const data = await checkOnce();
      if (data?.paid) {
        if (!mountedRef.current) return;
        setPaid(true);
        setStatus(t("payment_success"));
        // stop further polling
        if (pollRef.current) {
          window.clearInterval(pollRef.current);
          pollRef.current = null;
        }
        // small delay then redirect to order page
        setTimeout(() => {
          if (orderId)
            router.push(
              `/${
                /* locale not available here, use fallback */ "mn"
              }/orders/${orderId}`
            );
        }, 1500);
        return;
      }

      // otherwise, set up interval
      if (!pollRef.current) {
        pollRef.current = window.setInterval(async () => {
          const data2 = await checkOnce();
          if (data2?.paid && mountedRef.current) {
            setPaid(true);
            setStatus(t("payment_success"));
            if (pollRef.current) {
              window.clearInterval(pollRef.current);
              pollRef.current = null;
            }
            setTimeout(() => {
              if (orderId) router.push(`/${"mn"}/orders/${orderId}`);
            }, 1500);
          }
        }, 5000);
      }
    })();

    return () => {
      if (pollRef.current) {
        window.clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId, paid]);

  /* ---------------- UI guards ---------------- */
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
            {paid
              ? t("payment_confirmed_message") ?? t("payment_confirm_message")
              : t("payment_confirm_message")}
          </p>

          {!paid && qrText && (
            <div className="flex flex-col items-center gap-4">
              {/* QR WHITE ISLAND (INTENTIONAL) */}
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

          {/* Small actions */}
          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={() => {
                // manual refresh
                if (orderId) fetchOrder(orderId);
              }}
              className="h-[40px] px-4 rounded-md border border-border text-sm"
            >
              {t("refresh")}
            </button>

            <button
              onClick={() => {
                // go to order details (if available)
                if (orderId) router.push(`/${"mn"}/orders/${orderId}`);
              }}
              className="h-[40px] px-4 rounded-md bg-muted text-sm"
            >
              {t("view_order")}
            </button>
          </div>
        </section>

        {/* ORDER SUMMARY */}
        {order?.items?.length ? (
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
        ) : (
          // empty placeholder while loading or if no items
          <aside className="w-full lg:w-[380px] bg-card border border-border rounded-2xl p-6 space-y-6">
            <h3 className="text-base font-semibold border-b border-border pb-2">
              {t("order_details")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {loadingOrder ? t("loading") : t("order_not_found")}
            </p>
          </aside>
        )}
      </div>
    </main>
  );
}
