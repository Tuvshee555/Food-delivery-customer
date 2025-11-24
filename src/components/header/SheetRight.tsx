"use client";

import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect, useCallback, useRef } from "react";
import { PayFood } from "../PayFood";
import { OrderHistory } from "../OrderHistory";
import { useAuth } from "@/app/provider/AuthProvider";
import { useCart } from "@/app/store/cartStore";

export const SheetRight = () => {
  const { userId, token } = useAuth();
  const { items, load } = useCart();
  const [page, setPage] = useState<number>(1);
  const [cartCount, setCartCount] = useState<number>(0);
  const alreadySynced = useRef(false);

  const loadLocalCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const qty = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
    setCartCount(qty);
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
      const items = data.items || [];

      const qty = items.reduce(
        (sum: number, item: any) => sum + (item.quantity || 1),
        0
      );

      setCartCount(qty);
    } catch (err) {
      console.error("Cart load error:", err);
    }
  }, [userId, token]);

  const syncLocalToServer = useCallback(async () => {
    if (!userId || !token) return;
    if (alreadySynced.current) return; // prevent repeated sync loops

    const raw = localStorage.getItem("cart");
    if (!raw) {
      await loadServerCartCount();
      return;
    }

    const local = JSON.parse(raw);
    if (!local.length) {
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

  return (
    <Sheet>
      <SheetTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center justify-center w-[42px] h-[42px] 
                     rounded-full border border-gray-700 bg-[#1a1a1a] 
                     hover:border-[#facc15] transition-all duration-300 
                     hover:shadow-[0_0_12px_rgba(250,204,21,0.3)] group"
        >
          <ShoppingCart
            className="w-[20px] h-[20px] text-gray-300 group-hover:text-[#facc15]"
            strokeWidth={1.8}
          />

          {cartCount > 0 && (
            <motion.span
              key={cartCount}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="absolute -top-[6px] -right-[6px] bg-[#facc15] text-black 
                         text-[11px] font-bold rounded-full w-[18px] h-[18px] 
                         flex items-center justify-center shadow-[0_0_10px_rgba(250,204,21,0.5)]"
            >
              {cartCount}
            </motion.span>
          )}
        </motion.button>
      </SheetTrigger>

      <SheetContent
        key={cartCount}
        className="sm:max-w-[538px] p-[32px] bg-[#101010] border-l border-gray-800 text-white flex flex-col gap-6"
      >
        <SheetHeader>
          <div className="flex items-center gap-3">
            <SheetTitle className="flex items-center gap-2 text-[#facc15] text-lg">
              <ShoppingCart className="w-5 h-5" /> Order detail
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="h-[44px] w-full bg-[#1a1a1a] p-1 gap-2 rounded-full flex border border-gray-800">
          <div
            className={`w-full h-full rounded-full flex items-center justify-center text-sm font-medium cursor-pointer transition-all duration-300 ${
              page === 1
                ? "bg-gradient-to-r from-[#facc15] to-[#fbbf24] text-black"
                : "text-gray-300 hover:text-[#facc15]"
            }`}
            onClick={() => setPage(1)}
          >
            Cart
          </div>

          <div
            className={`w-full h-full rounded-full flex items-center justify-center text-sm font-medium cursor-pointer transition-all duration-300 ${
              page === 2
                ? "bg-gradient-to-r from-[#facc15] to-[#fbbf24] text-black"
                : "text-gray-300 hover:text-[#facc15]"
            }`}
            onClick={() => setPage(2)}
          >
            Orders
          </div>
        </div>

        <div className="mt-3 flex-1 overflow-y-auto custom-scrollbar">
          {page === 1 && <PayFood key={cartCount} />}
          {page === 2 && <OrderHistory />}
        </div>
      </SheetContent>
    </Sheet>
  );
};
