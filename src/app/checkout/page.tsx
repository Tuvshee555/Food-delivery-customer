"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import InfoStep from "./components/InfoStep";
import CartStep from "./components/CartStep";
import { useAuth } from "@/app/provider/AuthProvider";
import axios from "axios";

function CheckoutInner() {
  const router = useRouter();
  const step = useSearchParams().get("step") || "cart";
  const { userId, token, loading: authLoading } = useAuth();
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const syncLocalCart = useCallback(async () => {
    if (!userId || !token) return;

    const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (!localCart.length) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, items: localCart }),
      });

      localStorage.removeItem("cart");
      localStorage.setItem("cart-updated", Date.now().toString());
    } catch (error) {
      console.error("Checkout sync failed:", error);
    }
  }, [userId, token]);

  const fetchCart = useCallback(async () => {
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

      setCart(res.data.items || []);
    } catch (error) {
      console.error("Cart fetch error:", error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    const run = async () => {
      if (!token) return;
      await syncLocalCart();
      await fetchCart();
    };
    run();
  }, [userId, token, syncLocalCart, fetchCart]);

  if (authLoading || loading) {
    return <p className="text-white p-10">Түр хүлээнэ үү...</p>;
  }

  if (step === "info") {
    return <InfoStep router={router} cart={cart} refreshCart={fetchCart} />;
  }

  return <CartStep />;
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<p className="text-white p-10">Түр хүлээнэ үү...</p>}>
      <CheckoutInner />
    </Suspense>
  );
}
