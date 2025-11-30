/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useAuth } from "@/app/[locale]/provider/AuthProvider";
import { useState, useEffect, useCallback, useRef } from "react";

type CartItem = {
  // allow flexible shape, but quantity can be number or string from some sources
  id?: string;
  foodId?: string;
  quantity?: number | string | unknown;
  [key: string]: unknown;
};

const normalizeQuantity = (val: unknown): number => {
  if (typeof val === "number" && Number.isFinite(val)) return val;
  if (typeof val === "string") {
    const n = Number(val);
    if (!Number.isNaN(n) && Number.isFinite(n)) return n;
  }
  // default fallback if quantity missing or invalid
  return 1;
};

export const useCartSync = (): number => {
  const { userId, token } = useAuth();
  const [cartCount, setCartCount] = useState<number>(0);
  const alreadySynced = useRef(false);

  const loadLocalCartCount = useCallback(() => {
    const raw = localStorage.getItem("cart") || "[]";
    let parsed: unknown;

    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("Failed to parse local cart:", err);
      setCartCount(0);
      return;
    }

    if (!Array.isArray(parsed)) {
      setCartCount(0);
      return;
    }

    const items = parsed as CartItem[];
    const qty = items.reduce(
      (sum, item) => sum + normalizeQuantity(item?.quantity),
      0
    );
    setCartCount(qty);
  }, []);

  const ensureGuestExists = useCallback(async () => {
    if (!token?.startsWith("guest-token-")) return;
    if (!userId?.startsWith("guest-")) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/guest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId: userId }),
      });
    } catch (err) {
      console.error("Failed to ensure guest exists:", err);
    }
  }, [userId, token]);

  const loadServerCartCount = useCallback(
    async (fallbackToLocal = true) => {
      if (!userId || !token) {
        if (fallbackToLocal) loadLocalCartCount();
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          if (fallbackToLocal) loadLocalCartCount();
          return;
        }

        const data = await res.json();
        const items = Array.isArray(data?.items)
          ? (data.items as CartItem[])
          : [];
        const qty = items.reduce(
          (sum, item) => sum + normalizeQuantity(item?.quantity),
          0
        );
        setCartCount(qty);
      } catch (err) {
        console.error("Cart load error:", err);
        if (fallbackToLocal) loadLocalCartCount();
      }
    },
    [userId, token, loadLocalCartCount]
  );

  const syncLocalToServer = useCallback(
    async (force = false) => {
      if (!userId || !token) return;
      if (alreadySynced.current && !force) return;

      const raw = localStorage.getItem("cart");
      if (!raw) {
        await loadServerCartCount();
        return;
      }

      let local: unknown;
      try {
        local = JSON.parse(raw);
      } catch (err) {
        console.error("Failed to parse local cart for sync:", err);
        await loadServerCartCount();
        return;
      }

      if (!Array.isArray(local) || !local.length) {
        await loadServerCartCount();
        return;
      }

      alreadySynced.current = true;
      localStorage.setItem("cart-backup", raw);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/sync`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId, items: local }),
          }
        );

        if (!res.ok) throw new Error("Sync failed");

        localStorage.removeItem("cart");
        localStorage.removeItem("cart-backup");
        localStorage.setItem("cart-updated", Date.now().toString());

        window.dispatchEvent(new Event("cart-updated"));
        await loadServerCartCount();
      } catch (err) {
        console.error("Cart sync error:", err);
        const backup = localStorage.getItem("cart-backup");
        if (backup) localStorage.setItem("cart", backup);
        await loadServerCartCount();
      }
    },
    [userId, token, loadServerCartCount]
  );

  useEffect(() => {
    if (!token || !userId) {
      loadLocalCartCount();
      return;
    }

    const run = async () => {
      await ensureGuestExists();
      await syncLocalToServer();
      await loadServerCartCount();
    };

    run();
    // note: dependencies intentionally include callbacks used above
  }, [
    userId,
    token,
    ensureGuestExists,
    syncLocalToServer,
    loadServerCartCount,
  ]);

  useEffect(() => {
    const handler = () => {
      if (!token || !userId) loadLocalCartCount();
      else loadServerCartCount();
    };

    window.addEventListener("cart-updated", handler);
    return () => window.removeEventListener("cart-updated", handler);
  }, [token, userId, loadLocalCartCount, loadServerCartCount]);

  return cartCount;
};
