"use client";

import { useEffect, useState, useCallback } from "react";
import { SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/app/provider/AuthProvider";
import { AddLocation } from "./header/AddLocation";
import { useCart } from "@/app/store/cartStore";

type CartItem = {
  id?: string;
  foodId: string;
  quantity: number;
  selectedSize: string | null;
  food: { id: string; foodName: string; price: number; image: string };
};

export const PayFood = () => {
  const { userId, token } = useAuth();
  const { load } = useCart();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [tick, setTick] = useState(0);

  const loadLocalCart = useCallback(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
    setTotalPrice(
      cart.reduce(
        (sum: number, item: CartItem) => sum + item.food.price * item.quantity,
        0
      )
    );
  }, []);

  const loadServerCart = useCallback(async () => {
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
      setCartItems(items);
      setTotalPrice(
        items.reduce(
          (sum: number, i: CartItem) => sum + i.food.price * i.quantity,
          0
        )
      );
    } catch (err) {
      console.error("Cart load error:", err);
    }
  }, [userId, token]);

  // single effect: initial load + cart-updated listener
  useEffect(() => {
    const handler = () => {
      setTick((t) => t + 1);
      if (!userId || !token) loadLocalCart();
      else loadServerCart();
    };

    // initial load
    if (!userId || !token) loadLocalCart();
    else loadServerCart();

    window.addEventListener("cart-updated", handler);
    return () => window.removeEventListener("cart-updated", handler);
  }, [userId, token, loadLocalCart, loadServerCart]);

  const updateQuantity = async (item: CartItem, change: number) => {
    const newQty = Math.max(1, item.quantity + change);
    if (!userId || !token) {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const target = cart.find(
        (i: any) =>
          i.foodId === item.foodId && i.selectedSize === item.selectedSize
      );
      if (!target) return;
      target.quantity = newQty;
      localStorage.setItem("cart", JSON.stringify(cart));
      localStorage.setItem("cart-updated", Date.now().toString());
      window.dispatchEvent(new CustomEvent("cart-updated"));
      return;
    }

    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: item.id, quantity: newQty }),
      });
      window.dispatchEvent(new CustomEvent("cart-updated"));
    } catch {
      toast.error("Алдаа гарлаа.");
    }
  };

  const removeItem = async (
    itemIdOrFoodId: string,
    selectedSize: string | null
  ) => {
    if (!userId || !token) {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const filtered = cart.filter(
        (i: any) =>
          !(i.foodId === itemIdOrFoodId && i.selectedSize === selectedSize)
      );
      localStorage.setItem("cart", JSON.stringify(filtered));
      localStorage.setItem("cart-updated", Date.now().toString());
      window.dispatchEvent(new CustomEvent("cart-updated"));
      return;
    }

    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: itemIdOrFoodId }),
      });
      window.dispatchEvent(new CustomEvent("cart-updated"));
    } catch {
      toast.error("Алдаа гарлаа.");
    }
  };

  const clearAll = async () => {
    if (!userId || !token) {
      localStorage.removeItem("cart");
      localStorage.setItem("cart-updated", Date.now().toString());
      window.dispatchEvent(new CustomEvent("cart-updated"));
      return;
    }

    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/clear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });
      window.dispatchEvent(new CustomEvent("cart-updated"));
    } catch {
      toast.error("Алдаа гарлаа.");
    }
  };
  return (
    <>
      <AddLocation
        open={locationDialogOpen}
        onOpenChange={setLocationDialogOpen}
      />

      <div className="w-full bg-[#0e0e0e] text-white rounded-2xl border border-gray-800 p-5 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">🛍 Таны сагс</h1>

          {cartItems.length > 0 && (
            <button
              onClick={clearAll}
              className="text-gray-400 hover:text-red-500"
            >
              🗑 Хоослох
            </button>
          )}
        </div>

        <div className="space-y-5 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
          {cartItems.length ? (
            cartItems.map((item) => (
              <div
                key={item.id || item.foodId}
                className="flex justify-between items-center border-b border-gray-800 pb-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.food.image}
                    alt={item.food.foodName}
                    className="w-[72px] h-[72px] rounded-xl"
                  />
                  <div>
                    <p className="font-semibold">{item.food.foodName}</p>
                    <p className="text-gray-400 text-sm">
                      ₮ {item.food.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item, -1)}
                    className="px-3 py-1 bg-[#1c1c1c] rounded-full"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="px-4 py-1 bg-[#facc15] text-black font-semibold rounded-full">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => updateQuantity(item, 1)}
                    className="px-3 py-1 bg-[#1c1c1c] rounded-full"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() =>
                      removeItem(item.id || item.foodId, item.selectedSize)
                    }
                  >
                    <X className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-10">
              Сагс хоосон байна.
            </p>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="pt-4 border-t border-gray-800">
            <div className="flex justify-between text-lg font-semibold mb-4">
              <span>Нийт дүн</span>
              <span className="text-[#facc15]">
                ₮ {totalPrice.toLocaleString()}
              </span>
            </div>

            <Button
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#facc15] to-[#fbbf24] text-black font-semibold text-lg"
              onClick={() => (window.location.href = "/checkout")}
            >
              Төлбөр төлөх
            </Button>
          </div>
        )}
      </div>

      <SheetFooter />
    </>
  );
};
