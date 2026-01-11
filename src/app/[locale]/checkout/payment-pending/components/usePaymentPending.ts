/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { OrderData } from "./types";

export function usePaymentPending() {
  const { t, locale } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [orderId, setOrderId] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderData | null>(null);

  const [qrText, setQrText] = useState<string | null>(null);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);

  const [paid, setPaid] = useState(false);
  const [status, setStatus] = useState<string>(t("payment_creating"));
  const [loadingOrder, setLoadingOrder] = useState(false);

  const pollRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const hasRequestedInvoice = useRef(false);

  /** 🧹 MOUNT / UNMOUNT */
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  /** 🔗 ORDER ID FROM URL / STORAGE */
  useEffect(() => {
    const fromUrl = searchParams.get("orderId");
    if (fromUrl) {
      setOrderId(fromUrl);
      localStorage.setItem("lastOrderId", fromUrl);
      return;
    }

    const stored = localStorage.getItem("lastOrderId");
    if (stored) setOrderId(stored);
  }, [searchParams]);

  /** 📦 FETCH ORDER */
  const fetchOrder = async (id: string) => {
    setLoadingOrder(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/${id}`,
        { headers }
      );

      if (mountedRef.current) setOrder(res.data ?? null);
    } catch {
      toast.error(t("order_not_found"));
      if (mountedRef.current) setOrder(null);
    } finally {
      if (mountedRef.current) setLoadingOrder(false);
    }
  };

  useEffect(() => {
    if (orderId) fetchOrder(orderId);
  }, [orderId]);

  /** 🔑 CORE PAYMENT LOGIC (REFRESH SAFE) */
  useEffect(() => {
    if (!order) return;

    /** ✅ ALREADY PAID */
    if (order.status === "PAID" || order.status === "DELIVERED") {
      setPaid(true);
      setQrText(null);
      setStatus(t("payment_success"));
      router.push(`/${locale}/profile/orders/${order.id}`);

      return;
    }

    /** 🚚 NOT ONLINE PAYMENT */
    if (order.paymentMethod !== "QPAY") {
      router.push(`/${locale}/profile/orders/${order.id}`);
      return;
    }

    /** 🔁 RESTORE EXISTING PAYMENT (REFRESH FIX) */
    if (order.payment?.status === "PENDING") {
      if (order.payment.invoiceId) {
        setInvoiceId(order.payment.invoiceId);
      }
      if (order.payment.qrText) {
        setQrText(order.payment.qrText);
      }
      setStatus(t("payment_waiting"));
    }

    /** 🆕 CREATE INVOICE ONLY IF NONE EXISTS */
    if (
      order.status === "WAITING_PAYMENT" &&
      !order.payment?.invoiceId &&
      !hasRequestedInvoice.current
    ) {
      hasRequestedInvoice.current = true;

      (async () => {
        try {
          const token = localStorage.getItem("token");
          const headers = token ? { Authorization: `Bearer ${token}` } : {};

          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/qpay/create`,
            { orderId: order.id, amount: order.totalPrice },
            { headers }
          );

          if (!res.data?.qr_text || !res.data?.invoice_id) {
            toast.error(t("payment_qr_error"));
            return;
          }

          if (mountedRef.current) {
            setQrText(res.data.qr_text);
            setInvoiceId(res.data.invoice_id);
            setStatus(t("payment_waiting"));
          }
        } catch {
          toast.error(t("payment_create_fail"));
        }
      })();
    }
  }, [order]);

  /** 🔁 POLLING PAYMENT STATUS */
  useEffect(() => {
    if (!invoiceId || paid) return;

    const check = async () => {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/qpay/check`,
          { invoiceId }
        );
        return res.data;
      } catch {
        return null;
      }
    };

    pollRef.current = window.setInterval(async () => {
      const data = await check();
      if (data?.paid && mountedRef.current) {
        setPaid(true);
        setStatus(t("payment_success"));
        clearInterval(pollRef.current!);

        setTimeout(() => {
          router.push(`/${locale}/profile/orders/${orderId}`);
        }, 1500);
      }
    }, 5000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [invoiceId, paid]);

  return {
    t,
    orderId,
    order,
    qrText,
    paid,
    status,
    loadingOrder,
  };
}
