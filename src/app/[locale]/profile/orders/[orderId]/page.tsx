/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { OrderDetails } from "./types";
import { ItemsList } from "./ItemsList";

import { useAuth } from "@/app/[locale]/provider/AuthProvider";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { OrderMeta } from "../components/OrderMeta";
import { DeliveryInfo } from "../components/DeliveryInfo";
import { OrderCostSummary } from "../components/OrderCostSummary";
import { QPayPaymentBlock } from "../components/QPayPaymentBlock";

export default function OrderDetailPage() {
  const { userId, token, loading: authLoading } = useAuth();

  const params = useParams();
  const router = useRouter();
  const { locale, t } = useI18n();

  const orderId = typeof params.orderId === "string" ? params.orderId : null;

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [orderLoading, setOrderLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    if (!orderId || !token) return;

    setOrderLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("fetch_failed");

      const data = await res.json();
      setOrder(data);
    } catch {
      toast.error(t("order_not_found"));
      setOrder(null);
    } finally {
      setOrderLoading(false);
    }
  }, [orderId, token, t]);

  useEffect(() => {
    if (authLoading) return; // ✅ WAIT UNTIL AUTH HYDRATES

    if (!token || !userId) {
      router.push(`/${locale}/log-in`);
      return;
    }

    if (!orderId) {
      toast.error(t("order_not_found"));
      return;
    }

    fetchOrder();
  }, [fetchOrder, token, userId, orderId, locale, t, router, authLoading]);

  // Poll while waiting payment so frontend updates when webhook flips order to PAID
  useEffect(() => {
    if (!order) return;

    let id: ReturnType<typeof setInterval> | null = null;

    if (order.status === "WAITING_PAYMENT") {
      id = setInterval(() => {
        fetchOrder();
      }, 300000);
    }

    return () => {
      if (id) clearInterval(id);
    };
  }, [order?.status, fetchOrder]);

  // ✅ show loader while auth OR order is loading
  if (authLoading || orderLoading) {
    return (
      <p className="text-center mt-16 text-sm text-muted-foreground">
        {t("loading")}
      </p>
    );
  }

  if (!order) {
    return (
      <p className="text-center mt-16 text-sm text-muted-foreground max-w-prose mx-auto">
        {t("order_not_found")}
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-6 sm:pt-[130px] pb-56 lg:pb-28 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        <OrderMeta order={order} />

        <DeliveryInfo order={order} />

        <QPayPaymentBlock order={order} onRefresh={fetchOrder} />

        <ItemsList items={order.items} />

        <OrderCostSummary order={order} />
      </div>
    </div>
  );
}
