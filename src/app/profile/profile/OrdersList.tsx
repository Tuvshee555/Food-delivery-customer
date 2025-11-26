"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/app/provider/AuthProvider";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type OrderStatus = "PENDING" | "DELIVERED" | "CANCELLED";

type OrderItem = {
  id: string;
  quantity: number;
  food: { id: string; foodName: string };
};

type Order = {
  id: string;
  totalPrice: number;
  createdAt: string;
  location: string;
  status: OrderStatus;
  foodOrderItems: OrderItem[];
};

export const OrdersList = () => {
  const { userId, token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const fetchOrders = useCallback(async () => {
    if (!userId || !token) return;

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(res.data.orders || res.data || []);
    } catch {
      toast.error("Захиалгуудыг ачаалах үед алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  }, [token, userId]);

  useEffect(() => {
    if (!token) return;

    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // 🔁 realtime refresh

    return () => clearInterval(interval);
  }, [token, fetchOrders]);

  if (loading)
    return (
      <p className="text-gray-400 text-center mt-8 animate-pulse">
        ⏳ Ачааллаж байна...
      </p>
    );

  if (!orders.length)
    return (
      <p className="text-gray-400 text-center mt-8">
        🛍 Одоогоор захиалга байхгүй.
      </p>
    );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Миний захиалгууд</h1>

      <div className="space-y-5">
        {orders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border border-gray-700 rounded-2xl p-6 bg-[#111] hover:border-[#facc15]/70 transition"
          >
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-gray-400 text-sm">
                  Захиалгын ID:{" "}
                  <span className="text-gray-300">{order.id}</span>
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  📅 {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* STATUS */}
              <span
                className={
                  "px-3 py-1 rounded-full text-xs font-medium " +
                  (order.status === "PENDING"
                    ? "bg-yellow-700/30 text-yellow-400"
                    : order.status === "DELIVERED"
                    ? "bg-green-700/30 text-green-400"
                    : "bg-red-700/30 text-red-400")
                }
              >
                {order.status === "PENDING"
                  ? "Хүлээгдэж байна ⏳"
                  : order.status === "DELIVERED"
                  ? "Хүргэгдсэн ✅"
                  : "Цуцлагдсан ❌"}
              </span>
            </div>

            <div className="mb-3">
              <p className="text-[#facc15] font-semibold text-lg">
                {order.totalPrice.toLocaleString()}₮
              </p>
              <p className="text-gray-400 text-sm mt-1">📍 {order.location}</p>
            </div>

            {/* More button */}
            <button
              onClick={() => router.push(`/profile/orders/${order.id}`)}
              className="text-[#facc15] underline text-sm hover:text-yellow-400 transition"
            >
              ➜ Дэлгэрэнгүй харах
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
