/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import InfoStep from "./components/InfoStep";
import axios from "axios";
import CartStep from "@/components/cartStep/CartStep";
import { useAuth } from "../provider/AuthProvider";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

function CheckoutInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState("cart");

  const { locale, t } = useI18n();
  const { userId, token, loading: authLoading } = useAuth();

  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // sync step with URL
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

    localStorage.setItem("cart-backup", localCartRaw);

    try {
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

    if (!userId && token) return; // wait for userId decode

    if (!token) {
      const pathname = window.location.pathname;
      router.push(`/${locale}/sign-in?redirect=${pathname}`);
      return;
    }

    const run = async () => {
      await new Promise((r) => setTimeout(r, 120));
      await syncLocalCart();
      await fetchCart();
    };

    run();
  }, [authLoading, userId, token]);

  if (authLoading || loading) {
    return <p className="text-white p-10">{t("loading")}</p>;
  }

  return step === "info" ? (
    <InfoStep router={router} cart={cart} refreshCart={fetchCart} />
  ) : (
    <CartStep />
  );
}

export default function CheckoutPage() {
  const { t } = useI18n();
  return (
    <Suspense fallback={<p className="text-white p-10">{t("loading")}</p>}>
      <CheckoutInner />
    </Suspense>
  );
}
