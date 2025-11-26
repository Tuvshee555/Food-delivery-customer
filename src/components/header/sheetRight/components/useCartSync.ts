/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/app/provider/AuthProvider";

export const useCartSync = () => {
  const { userId, token } = useAuth();
  const [cartCount, setCartCount] = useState<number>(0);
  const alreadySynced = useRef(false);

  const loadLocalCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(Array.isArray(cart) ? cart.length : 0);
  };

  const ensureGuestExists = async () => {
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
  };

  const loadServerCartCount = useCallback(async () => {
    if (!userId || !token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      const items = Array.isArray(data?.items) ? data.items : [];
      setCartCount(items.length);
    } catch (err) {
      console.error("Cart load error:", err);
    }
  }, [userId, token]);

  const syncLocalToServer = useCallback(async () => {
    if (!userId || !token) return;
    if (alreadySynced.current) return;

    const raw = localStorage.getItem("cart");
    if (!raw) {
      await loadServerCartCount();
      return;
    }

    let local;
    try {
      local = JSON.parse(raw);
    } catch {
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
  }, [userId, token, loadServerCartCount]);

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
  }, [userId, token, syncLocalToServer, loadServerCartCount]);

  useEffect(() => {
    const handler = () => {
      if (!token || !userId) loadLocalCartCount();
      else loadServerCartCount();
    };

    window.addEventListener("cart-updated", handler);
    return () => window.removeEventListener("cart-updated", handler);
  }, [token, userId, loadServerCartCount]);

  return cartCount;
};
