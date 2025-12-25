"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Clock, MapPin, Receipt } from "lucide-react";
import { useAuth } from "../../provider/AuthProvider";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

export type OrderStatus = "PENDING" | "DELIVERED" | "CANCELLED";

export type OrderItem = {
  id: string;
  quantity: number;
  food: { id: string; foodName: string };
};

export type Order = {
  id: string;
  totalPrice: number;
  createdAt: string;
  location: string;
  status: OrderStatus;
  foodOrderItems: OrderItem[];
};

export const OrdersList = () => {
  const { userId, token } = useAuth();
  const router = useRouter();
  const { locale, t } = useI18n();

  const fetchOrders = async (): Promise<Order[]> => {
    if (!userId || !token) return [];
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/user/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.orders || res.data || [];
  };

  const {
    data: orders = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["orders", userId],
    queryFn: fetchOrders,
    enabled: !!token,
    refetchInterval: 10000,
  });

  const statusStyle: Record<OrderStatus, string> = {
    PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    DELIVERED: "bg-green-500/10 text-green-600 border-green-500/20",
    CANCELLED: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  const statusLabel: Record<OrderStatus, string> = {
    PENDING: t("order_status_pending"),
    DELIVERED: t("order_status_delivered"),
    CANCELLED: t("order_status_cancelled"),
  };

  /* ---------- Loading ---------- */
  if (isLoading) {
    return (
      <div className="space-y-4 mt-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-xl bg-card border border-border animate-pulse"
          />
        ))}
      </div>
    );
  }

  /* ---------- Empty ---------- */
  if (!orders.length) {
    return (
      <div className="text-center mt-16 space-y-2">
        <Receipt className="mx-auto w-6 h-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{t("orders_empty")}</p>
      </div>
    );
  }

  return (
    <div
      className="
      space-y-6
      mt-5 sm:mt-0
      px-4 sm:px-0
    "
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Receipt className="w-5 h-5" />
        <h1 className="text-lg font-semibold">{t("my_orders")}</h1>
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {orders.map((order, i) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.03 }}
            className="
              bg-card border border-border rounded-xl
              p-4 sm:p-5
              space-y-4
            "
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{t("order_id")}</p>
                <p className="text-sm font-medium truncate">{order.id}</p>
              </div>

              <span
                className={`text-xs px-2 py-1 rounded-md border whitespace-nowrap ${
                  statusStyle[order.status]
                }`}
              >
                {statusLabel[order.status]}
              </span>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock size={14} />
                {new Date(order.createdAt).toLocaleDateString()}
              </div>

              <div className="flex items-center gap-2 text-muted-foreground truncate">
                <MapPin size={14} />
                <span className="truncate">{order.location}</span>
              </div>
            </div>

            {/* Items */}
            {order.foodOrderItems?.length > 0 && (
              <p className="text-xs text-muted-foreground leading-relaxed">
                {order.foodOrderItems
                  .map((item) => `${item.quantity}× ${item.food.foodName}`)
                  .join(" · ")}
              </p>
            )}

            {/* Bottom */}
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <p className="text-base font-semibold">
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
        ))}
      </div>

      {/* Background refresh indicator */}
      {isFetching && (
        <p className="text-xs text-center text-muted-foreground">
          {t("refreshing")}
        </p>
      )}
    </div>
  );
};
