"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import InfoStep from "./components/InfoStep";
import CartStep from "./components/CartStep";
import { useAuth } from "@/app/provider/AuthProvider";
import axios from "axios";

export default function CheckoutPage() {
  const router = useRouter();
  const step = useSearchParams().get("step") || "cart";

  const { userId, token } = useAuth();
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    if (!userId || !token) {
      setCart([]);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // FIXED HERE ⚠️
      setCart(res.data.items || []);
    } catch (error) {
      console.error("Cart fetch error:", error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId, token]);

  if (loading) return <p className="text-white p-10">Түр хүлээнэ үү...</p>;

  if (step === "info")
    return <InfoStep router={router} cart={cart} refreshCart={fetchCart} />;

  return <CartStep cart={cart} router={router} refreshCart={fetchCart} />;
}
