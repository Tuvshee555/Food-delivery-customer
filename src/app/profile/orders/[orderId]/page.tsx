/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/provider/AuthProvider";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { OrderDetails } from "./types";
import { ItemsList } from "./ItemsList";
import { Summary } from "./Summary";
import { Timeline } from "./Timeline";

export default function OrderDetailPage() {
  const { userId, token } = useAuth();
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !userId) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error("Failed to fetch order");
        const data = await res.json();
        setOrder(data);
      } catch (e) {
        toast.error("❌ Захиалга олдсонгүй");
      }
      setLoading(false);
    };

    fetchOrder();
  }, [token, userId, orderId]);

  if (loading)
    return (
      <p className="text-gray-400 text-center mt-10">⏳ Ачааллаж байна...</p>
    );

  if (!order)
    return (
      <p className="text-gray-400 text-center mt-10">❌ Захиалга олдсонгүй</p>
    );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-[130px] pb-24 px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* STATUS + TIMELINE */}
        <Timeline status={order.status} createdAt={order.createdAt} />

        {/* ITEMS */}
        <ItemsList items={order.items} />

        {/* SUMMARY */}
        <Summary order={order} onUpdated={() => {}} />
      </div>
    </div>
  );
}
