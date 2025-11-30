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

  const statusStyle: Record<OrderStatus, string> = {
    PENDING: "bg-yellow-500/20 text-yellow-400",
    DELIVERED: "bg-green-500/20 text-green-400",
    CANCELLED: "bg-red-500/20 text-red-400",
  };

  if (isLoading)
    return (
      <div className="space-y-4 mt-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800 animate-pulse"
          />
        ))}
      </div>
    );

  if (!orders.length)
    return (
      <p className="text-gray-400 text-center mt-8">{t("orders_empty")}</p>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
        <Receipt className="w-5 h-5" /> {t("my_orders")}
      </h1>

      {orders.map((order, i) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800 hover:border-[#facc15]/60 transition"
        >
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-gray-400 text-xs">{t("order_id")}:</p>
              <p className="text-gray-200 font-medium">{order.id}</p>
            </div>

            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                statusStyle[order.status]
              }`}
            >
              {t(`order_status_${order.status.toLowerCase()}`)}
            </span>
          </div>

          <div className="text-sm text-gray-300 space-y-2 mb-4">
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {order.location}
            </p>

            {order.foodOrderItems?.length > 0 && (
              <p className="text-gray-400 text-xs">
                {order.foodOrderItems
                  .map((item) => `${item.quantity}× ${item.food.foodName}`)
                  .join(" · ")}
              </p>
            )}
          </div>

          <div className="flex justify-between items-center">
            <p className="text-[#facc15] text-lg font-semibold">
              {order.totalPrice.toLocaleString()}₮
            </p>

            <button
              onClick={() =>
                router.push(`/${locale}/profile/orders/${order.id}`)
              }
              className="text-[#facc15] underline text-sm hover:text-yellow-300 transition"
            >
              {t("view_details")}
            </button>
          </div>
        </motion.div>
      ))}

      {isFetching && (
        <p className="text-gray-500 text-xs text-center">{t("refreshing")}</p>
      )}
    </div>
  );
};
