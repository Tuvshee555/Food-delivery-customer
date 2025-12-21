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
    refetchInterval: 10000,
    enabled: !!token,
  });

  const statusLabel: Record<OrderStatus, string> = {
    PENDING: t("order_status_pending"),
    DELIVERED: t("order_status_delivered"),
    CANCELLED: t("order_status_cancelled"),
  };

  if (isLoading)
    return (
      <div className="space-y-3 mt-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-lg border border-border bg-card animate-pulse"
          />
        ))}
      </div>
    );

  if (!orders.length)
    return <p className="text-center text-sm mt-8">{t("orders_empty")}</p>;

  return (
    <div className="space-y-5">
      <h1 className="text-base font-semibold flex items-center gap-2">
        <Receipt size={16} />
        {t("my_orders")}
      </h1>

      {orders.map((order, i) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: i * 0.04 }}
          className="bg-card border border-border rounded-lg p-4"
        >
          {/* Top */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs">{t("order_id")}</p>
              <p className="text-sm font-medium">{order.id}</p>
            </div>

            <span className="text-xs px-2 py-1 border border-border rounded-md">
              {statusLabel[order.status]}
            </span>
          </div>

          {/* Meta */}
          <div className="space-y-1 text-sm mb-3">
            <p className="flex items-center gap-2">
              <Clock size={14} />
              {new Date(order.createdAt).toLocaleDateString()}
            </p>

            <p className="flex items-center gap-2">
              <MapPin size={14} />
              {order.location}
            </p>

            {order.foodOrderItems?.length > 0 && (
              <p className="text-xs leading-relaxed">
                {order.foodOrderItems
                  .map((item) => `${item.quantity}× ${item.food.foodName}`)
                  .join(" · ")}
              </p>
            )}
          </div>

          {/* Bottom */}
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold">
              {order.totalPrice.toLocaleString()}₮
            </p>

            <button
              onClick={() =>
                router.push(`/${locale}/profile/orders/${order.id}`)
              }
              className="text-sm underline"
            >
              {t("view_details")}
            </button>
          </div>
        </motion.div>
      ))}

      {isFetching && <p className="text-xs text-center">{t("refreshing")}</p>}
    </div>
  );
};
