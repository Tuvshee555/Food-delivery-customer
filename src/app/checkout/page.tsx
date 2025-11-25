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

    const localCartRaw = localStorage.getItem("cart");
    if (!localCartRaw) return;

    const localCart = JSON.parse(localCartRaw);
    if (!localCart.length) return;

    // Create a backup in case sync fails
    localStorage.setItem("cart-backup", localCartRaw);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/sync`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId,
            items: localCart.map(
              (i: { foodId: any; quantity: any; selectedSize: any }) => ({
                foodId: i.foodId,
                quantity: i.quantity,
                selectedSize: i.selectedSize || null,
              })
            ),
          }),
        }
      );

      localStorage.removeItem("cart");
      localStorage.removeItem("cart-backup");
      localStorage.setItem("cart-updated", Date.now().toString());
    } catch (error) {
      console.error("Cart sync failed:", error);
    }
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

    // Prevent running too early
    if (token && !userId) return;

    if (!token) {
      router.push("/sign-in?redirect=/checkout");
      return;
    }

    const run = async () => {
      // Wait 100ms for safe token/userId availability
      await new Promise((r) => setTimeout(r, 120));

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
