"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Clock, MapPin, Receipt } from "lucide-react";

import { useAuth } from "../../provider/AuthProvider";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

/* 🔒 MUST MATCH BACKEND */
export type OrderStatus =
  | "PENDING"
  | "WAITING_PAYMENT"
  | "COD_PENDING"
  | "PAID"
  | "DELIVERING"
  | "DELIVERED"
  | "CANCELLED";

export type OrderListItem = {
  id: string;
  orderNumber: string;
  totalPrice: number;
  status: OrderStatus;
  paymentMethod: "COD" | "BANK" | "QPAY";
  createdAt: string;

  // 🔥 DELIVERY INFO
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  city?: string | null;
  district?: string | null;
  khoroo?: string | null;
  address?: string | null;
};

export const OrdersList = () => {
  const { userId, token } = useAuth();
  const router = useRouter();
  const { locale, t } = useI18n();

  const fetchOrders = async (): Promise<OrderListItem[]> => {
    if (!userId || !token) return [];

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/user/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return res.data?.orders ?? [];
  };

  const {
    data: orders = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["orders", userId],
    queryFn: fetchOrders,
    enabled: Boolean(userId && token),
    refetchInterval: 10000,
  });

  const statusStyle: Record<OrderStatus, string> = {
    PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    WAITING_PAYMENT: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    COD_PENDING: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    PAID: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    DELIVERING: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    DELIVERED: "bg-green-500/10 text-green-600 border-green-500/20",
    CANCELLED: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  const statusLabel: Record<OrderStatus, string> = {
    PENDING: t("order_status_pending"),
    WAITING_PAYMENT: t("order_status_waiting_payment"),
    COD_PENDING: t("order_status_cod_pending"),
    PAID: t("order_status_paid"),
    DELIVERING: t("order_status_delivering"),
    DELIVERED: t("order_status_delivered"),
    CANCELLED: t("order_status_cancelled"),
  };

  if (isLoading) {
    return (
      <div className="space-y-4 mt-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-card animate-pulse" />
        ))}
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="text-center mt-16 space-y-2">
        <Receipt className="mx-auto w-6 h-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{t("orders_empty")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-5 pb-[200px]">
      <div className="flex items-center gap-2">
        <Receipt className="w-5 h-5" />
        <h1 className="text-lg font-semibold">{t("my_orders")}</h1>
      </div>

      <div className="space-y-4">
        {orders.map((order, i) => {
          const addressLine = [
            order.city,
            order.district,
            order.khoroo,
            order.address,
          ]
            .filter(Boolean)
            .join(", ");

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-card border border-border rounded-xl p-4 space-y-3"
            >
              {/* Header */}
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {t("order_number")}
                  </p>
                  <p className="text-sm font-medium">#{order.orderNumber}</p>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded-md border ${
                    statusStyle[order.status]
                  }`}
                >
                  {statusLabel[order.status]}
                </span>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock size={14} />
                {new Date(order.createdAt).toLocaleDateString()}
              </div>

              {/* Delivery */}
              <div className="flex gap-2 text-sm">
                <MapPin size={14} className="mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium">
                    {order.firstName} {order.lastName} · {order.phone}
                  </p>
                  <p className="text-muted-foreground">{addressLine}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center pt-2 border-t border-border/50">
                <p className="font-semibold">
                  {order.totalPrice.toLocaleString()}₮
                </p>

                <button
                  onClick={() =>
                    router.push(`/${locale}/profile/orders/${order.id}`)
                  }
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {t("view_details")}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {isFetching && (
        <p className="text-xs text-center text-muted-foreground">
          {t("refreshing")}
        </p>
      )}
    </div>
  );
};
