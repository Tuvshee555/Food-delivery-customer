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
  const searchParams = useSearchParams();
  const [step, setStep] = useState("cart");

  const { userId, token, loading: authLoading } = useAuth();

  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Step loader fix
  useEffect(() => {
    const s = searchParams.get("step");
    setStep(s || "cart");
  }, [searchParams]);

  const syncLocalCart = useCallback(async () => {
    if (!userId || !token) return;

    const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (!localCart.length) return;

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
  }, [userId, token]);

  const fetchCart = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data.items || []);
    } catch {
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    if (authLoading) return;

    if (!userId || !token) {
      router.push("/sign-in?redirect=/checkout");
      return;
    }

    const run = async () => {
      await syncLocalCart();
      await fetchCart();
    };

    run();
  }, [authLoading, userId, token]);

  if (authLoading || loading) {
    return <p className="text-white p-10">Түр хүлээнэ үү...</p>;
  }

  return step === "info" ? (
    <InfoStep router={router} cart={cart} refreshCart={fetchCart} />
  ) : (
    <CartStep />
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<p className="text-white p-10">Түр хүлээнэ үү...</p>}>
      <CheckoutInner />
    </Suspense>
  );
}
