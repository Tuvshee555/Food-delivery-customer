"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { OrderDetails } from "./types";
import { ItemsList } from "./ItemsList";
import { Summary } from "./Summary";
import { Timeline } from "./Timeline";

import { useAuth } from "@/app/[locale]/provider/AuthProvider";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

export default function OrderDetailPage() {
  const { userId, token } = useAuth();
  const params = useParams();
  const router = useRouter();
  const { locale, t } = useI18n();

  const orderId = typeof params.orderId === "string" ? params.orderId : null;

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    if (!orderId || !token) return;

    setLoading(true);
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
      setLoading(false);
    }
  }, [orderId, token, t]);

  useEffect(() => {
    if (!token || !userId) {
      router.push(`/${locale}/log-in`);
      return;
    }

    if (!orderId) {
      toast.error(t("order_not_found"));
      return;
    }

    fetchOrder();
  }, [fetchOrder, token, userId, orderId, locale, t, router]);

  if (loading) {
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
    <div className="min-h-screen bg-background pt-[130px] pb-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* STATUS + TIMELINE */}
        <Timeline status={order.status} createdAt={order.createdAt} />

        {/* ITEMS */}
        <ItemsList items={order.items} />

        {/* SUMMARY */}
        <Summary order={order} onUpdated={fetchOrder} />
      </div>
    </div>
  );
}
