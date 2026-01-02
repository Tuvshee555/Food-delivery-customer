/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { OrderData } from "./types";

export function usePaymentPending() {
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
  const [token, setToken] = useState<string | null>(null);

  const hasRequestedInvoice = useRef(false);
  const pollRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    try {
      const t = localStorage.getItem("token");
      if (t) setToken(t);
    } catch {}
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const fromUrl = searchParams.get("orderId");
    if (fromUrl) {
      setOrderId(fromUrl);
      try {
        localStorage.setItem("lastOrderId", fromUrl);
      } catch {}
      return;
    }

    try {
      const fromStorage = localStorage.getItem("lastOrderId");
      if (fromStorage) setOrderId(fromStorage);
    } catch {}
  }, [searchParams]);

  const fetchOrder = async (id: string) => {
    setLoadingOrder(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/${id}`,
        { headers }
      );
      const payload = res.data?.order ?? res.data;
      if (mountedRef.current) setOrder(payload ?? null);
    } catch {
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
  }, [orderId, token]);

  useEffect(() => {
    if (!orderId || !order?.totalPrice) return;
    if (hasRequestedInvoice.current) return;

    hasRequestedInvoice.current = true;

    (async () => {
      try {
        const headers: any = { "Content-Type": "application/json" };
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
      } catch {
        toast.error(t("payment_create_fail"));
      }
    })();
  }, [order, orderId, token]);

  useEffect(() => {
    if (!invoiceId || paid) return;

    const checkOnce = async () => {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/qpay/check`,
          { invoiceId },
          { headers: { "Content-Type": "application/json" } }
        );
        return res.data ?? {};
      } catch {
        return null;
      }
    };

    (async () => {
      const data = await checkOnce();
      if (data?.paid && mountedRef.current) {
        setPaid(true);
        setStatus(t("payment_success"));
        setTimeout(() => {
          if (orderId) router.push(`/mn/orders/${orderId}`);
        }, 1500);
        return;
      }

      pollRef.current = window.setInterval(async () => {
        const data2 = await checkOnce();
        if (data2?.paid && mountedRef.current) {
          setPaid(true);
          setStatus(t("payment_success"));
          window.clearInterval(pollRef.current!);
          setTimeout(() => {
            if (orderId) router.push(`/mn/orders/${orderId}`);
          }, 1500);
        }
      }, 5000);
    })();

    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
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
