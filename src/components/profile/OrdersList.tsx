/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/app/provider/AuthProvider";
import { motion } from "framer-motion";

type OrderItem = {
  id: string;
  quantity: number;
  food: {
    id: string;
    foodName: string;
  };
};

type OrderType = {
  id: string;
  totalPrice: number;
  createdAt: string;
  location: string;
  status: "PENDING" | "DELIVERED" | "CANCELLED";
  foodOrderItems: OrderItem[];
};

export const OrdersList = () => {
  const { userId, token } = useAuth();
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);

  const getOrders = async () => {
    try {
      if (!userId || !token) return;

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const fetched = res.data.orders || res.data;
      setOrders(fetched);
    } catch (err: any) {
      console.error(err);
      toast.error("❌ Захиалгуудыг ачаалахад алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, [userId, token]);

  if (loading)
    return (
      <p className="text-gray-400 text-center mt-8 animate-pulse">
        ⏳ Захиалгуудыг ачааллаж байна...
      </p>
    );

  if (!orders.length)
    return (
      <p className="text-gray-400 text-center mt-8">
        🛍 Одоогоор захиалга алга байна.
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
            {/* Top section */}
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

              {/* ✅ Animated once per appearance */}
              {order.status === "PENDING" && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-700/30 text-yellow-400"
                >
                  Хүлээгдэж байна ⏳
                </motion.span>
              )}

              {order.status === "DELIVERED" && (
                <motion.span
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-green-700/30 text-green-400"
                >
                  Хүргэгдсэн ✅
                </motion.span>
              )}

              {order.status === "CANCELLED" && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-red-700/30 text-red-400"
                >
                  Цуцлагдсан ❌
                </motion.span>
              )}
            </div>

            {/* Total + Address */}
            <div className="mb-3">
              <p className="text-[#facc15] font-semibold text-lg">
                {order.totalPrice.toLocaleString()}₮
              </p>
              <p className="text-gray-400 text-sm mt-1">📍 {order.location}</p>
            </div>

            {/* Food items */}
            <div className="border-t border-gray-800 pt-3 mt-3">
              <h3 className="text-gray-300 font-medium text-sm mb-2">
                Захиалсан хоолнууд:
              </h3>
              <ul className="space-y-1">
                {order.foodOrderItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between text-sm text-gray-400"
                  >
                    <span>🍽 {item.food.foodName}</span>
                    <span>× {item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
