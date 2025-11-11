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
import { useState, useEffect } from "react";
import { PayFood } from "../PayFood";
import { OrderHistory } from "../OrderHistory";

export const SheetRight = () => {
  const [page, setPage] = useState<number>(1);
  const [cartCount, setCartCount] = useState<number>(0);

  // ✅ Load cart count from localStorage
  useEffect(() => {
    const loadCart = () => {
      const stored = localStorage.getItem("cart");
      const items = stored ? JSON.parse(stored) : [];
      // Count total quantity (not just items)
      const totalQty = items.reduce(
        (sum: number, item: any) => sum + (item.quantity || 1),
        0
      );
      setCartCount(totalQty);
    };

    loadCart();

    // ✅ Listen for storage updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cart") loadCart();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Sheet>
      {/* 🛒 Trigger button */}
      <SheetTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center justify-center w-[42px] h-[42px] 
                     rounded-full border border-gray-700 bg-[#1a1a1a] 
                     hover:border-[#facc15] transition-all duration-300 
                     hover:shadow-[0_0_12px_rgba(250,204,21,0.3)] group"
          aria-label="Open cart"
        >
          <ShoppingCart
            className="w-[20px] h-[20px] text-gray-300 group-hover:text-[#facc15] transition-colors"
            strokeWidth={1.8}
          />
          {/* 🧮 Real-time cart count badge */}
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

      {/* 🧾 Drawer content */}
      <SheetContent className="sm:max-w-[538px] p-[32px] bg-[#101010] border-l border-gray-800 text-white flex flex-col gap-6">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <SheetTitle className="flex items-center gap-2 text-[#facc15] text-lg">
              <ShoppingCart className="w-5 h-5" /> Order detail
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* 🟡 Tab switcher */}
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

        {/* 🧾 Page content */}
        <div className="mt-3 flex-1 overflow-y-auto custom-scrollbar">
          {page === 1 && <PayFood />}
          {page === 2 && <OrderHistory />}
        </div>
      </SheetContent>
    </Sheet>
  );
};
