/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useAuth } from "@/app/[locale]/provider/AuthProvider";
import { useState, useEffect, useCallback, useRef } from "react";

type CartItem = {
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
  return 1;
};

export const useCartSync = (): number => {
  const { userId, token } = useAuth();
  const [cartCount, setCartCount] = useState<number>(0);
  const alreadySynced = useRef(false);

  /* ---------------- local cart ---------------- */

  const loadLocalCartCount = useCallback(() => {
    const raw = localStorage.getItem("cart") || "[]";
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        setCartCount(0);
        return;
      }

      const qty = parsed.reduce(
        (sum: number, item: CartItem) =>
          sum + normalizeQuantity(item?.quantity),
        0
      );
      setCartCount(qty);
    } catch {
      setCartCount(0);
    }
  }, []);

  /* ---------------- guest ---------------- */

  const ensureGuestExists = useCallback(async () => {
    if (!token?.startsWith("guest-token-")) return;
    if (!userId?.startsWith("guest-")) return;
    if (!process.env.NEXT_PUBLIC_BACKEND_URL) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/guest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId: userId }),
      });
    } catch {
      // silent by design
    }
  }, [userId, token]);

  /* ---------------- server cart ---------------- */

  const loadServerCartCount = useCallback(
    async (fallbackToLocal = true) => {
      if (!userId || !token || !process.env.NEXT_PUBLIC_BACKEND_URL) {
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
        const items = Array.isArray(data?.items) ? data.items : [];
        const qty = items.reduce(
          (sum: number, item: CartItem) =>
            sum + normalizeQuantity(item?.quantity),
          0
        );
        setCartCount(qty);
      } catch {
        if (fallbackToLocal) loadLocalCartCount();
      }
    },
    [userId, token, loadLocalCartCount]
  );

  /* ---------------- sync ---------------- */

  const syncLocalToServer = useCallback(
    async (force = false) => {
      if (!userId || !token) return;
      if (!process.env.NEXT_PUBLIC_BACKEND_URL) return;
      if (!navigator.onLine) return;
      if (alreadySynced.current && !force) return;

      const raw = localStorage.getItem("cart");
      if (!raw) {
        await loadServerCartCount();
        return;
      }

      let local: unknown;
      try {
        local = JSON.parse(raw);
      } catch {
        await loadServerCartCount();
        return;
      }

      if (!Array.isArray(local) || local.length === 0) {
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

        if (!res.ok) {
          await loadServerCartCount();
          return;
        }

        localStorage.removeItem("cart");
        localStorage.removeItem("cart-backup");
        localStorage.setItem("cart-updated", Date.now().toString());

        window.dispatchEvent(new Event("cart-updated"));
        await loadServerCartCount();
      } catch {
        const backup = localStorage.getItem("cart-backup");
        if (backup) localStorage.setItem("cart", backup);
        await loadServerCartCount();
      }
    },
    [userId, token, loadServerCartCount]
  );

  /* ---------------- lifecycle ---------------- */

  useEffect(() => {
    if (!token || !userId) {
      loadLocalCartCount();
      return;
    }

    const run = async () => {
      try {
        await ensureGuestExists();
        await syncLocalToServer();
        await loadServerCartCount();
      } catch {
        loadLocalCartCount();
      }
    };

    run();
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
