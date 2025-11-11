"use client";

import React, { useEffect, useState, useCallback } from "react";
import { SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/app/provider/AuthProvider";
import { AddLocation } from "./header/AddLocation";
import { QPayDialog } from "@/app/qpay/QPayDialog";
import { Minus, Plus, X } from "lucide-react";

type FoodType = {
  id?: string;
  _id?: string;
  foodName: string;
  price: number;
  image: string;
};

type CartItemType = {
  food: FoodType;
  quantity: number;
};

export const PayFood = () => {
  const { userId, token } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const calculateTotal = useCallback(
    (items: CartItemType[]) =>
      items.reduce((sum, item) => sum + item.food.price * item.quantity, 0),
    []
  );

  useEffect(() => {
    try {
      const storedRaw = localStorage.getItem("cart") || "[]";
      const parsedCart: any[] = JSON.parse(storedRaw);

      const normalized = parsedCart.map((item) => {
        if (item.food) return item;
        const { quantity, ...food } = item;
        return { food, quantity: quantity || 1 };
      });

      setCartItems(normalized);
      setTotalPrice(calculateTotal(normalized));

      localStorage.setItem("cart", JSON.stringify(normalized));

      let existingOrderId = localStorage.getItem("currentOrderId");
      if (!existingOrderId) {
        existingOrderId = `ORDER_${Date.now()}`;
        localStorage.setItem("currentOrderId", existingOrderId);
      }
      setOrderId(existingOrderId);
    } catch {
      setCartItems([]);
      setTotalPrice(0);
    }
  }, [calculateTotal]);

  const updateQuantity = (index: number, change: number) => {
    const updated = [...cartItems];
    updated[index].quantity = Math.max(1, updated[index].quantity + change);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    setTotalPrice(calculateTotal(updated));
  };

  const removeCartItem = (index: number) => {
    const newCart = cartItems.filter((_, i) => i !== index);
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    setTotalPrice(calculateTotal(newCart));

    if (!newCart.length) {
      localStorage.removeItem("currentOrderId");
      setOrderId(null);
    }
  };

  const postFoodItems = useCallback(async () => {
    if (!userId) return toast.error("User not authenticated!");
    if (!cartItems.length) return toast.error("Your cart is empty.");

    const location = localStorage.getItem("address");
    if (!location) {
      toast.error("Please provide a delivery address!");
      setLocationDialogOpen(true);
      return;
    }

    const normalizedItems = cartItems.map((item) => ({
      foodId: item.food._id || item.food.id,
      quantity: item.quantity,
    }));

    if (normalizedItems.some((i) => !i.foodId)) {
      toast.error("One of the cart items is missing a valid ID.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          items: normalizedItems,
          totalPrice,
          location,
        }),
      });

      if (!res.ok) throw new Error("Failed to place order");

      toast.success("✅ Захиалга амжилттай хийгдлээ!");
      setCartItems([]);
      setTotalPrice(0);
      localStorage.removeItem("cart");
      localStorage.removeItem("currentOrderId");
      setOrderId(null);
    } catch (err: any) {
      console.error("Error placing order:", err);
      toast.error(err.message || "Failed to place order.");
    } finally {
      setIsSubmitting(false);
    }
  }, [cartItems, token, totalPrice, userId]);

  useEffect(() => {
    if (paymentDone) postFoodItems();
  }, [paymentDone, postFoodItems]);

  return (
    <>
      <AddLocation
        open={locationDialogOpen}
        onOpenChange={setLocationDialogOpen}
      />

      <div className="w-full bg-[#0e0e0e] text-white rounded-2xl border border-gray-800 p-5 flex flex-col gap-6 shadow-[0_0_30px_-10px_rgba(250,204,21,0.15)]">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">🛍 Таны сагс</h1>
          {cartItems.length > 0 && (
            <button
              onClick={() => {
                setCartItems([]);
                localStorage.removeItem("cart");
                setTotalPrice(0);
              }}
              className="flex items-center gap-2 text-gray-300 hover:text-red-500 border border-gray-700 hover:border-red-500 px-3 py-1.5 rounded-full text-sm transition-all"
            >
              🗑 Хоослох
            </button>
          )}
        </div>

        {/* Cart items */}
        <div className="space-y-5 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-gray-800 pb-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.food.image}
                    alt={item.food.foodName}
                    className="w-[72px] h-[72px] rounded-xl object-cover border border-gray-700"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-base">
                      {item.food.foodName}
                    </span>
                    <span className="text-gray-400 text-sm mt-1">
                      Хэмжээ: {item.quantity}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="text-[#facc15] font-semibold text-base">
                    ₮{(item.food.price * item.quantity).toLocaleString()}
                  </span>
                  <div className="flex items-center bg-gray-700/50 rounded-full overflow-hidden">
                    <button
                      onClick={() => updateQuantity(index, -1)}
                      className="px-3 py-1 hover:bg-gray-600 text-white"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-1 bg-white text-black font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(index, 1)}
                      className="px-3 py-1 hover:bg-gray-600 text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeCartItem(index)}
                  className="text-gray-400 hover:text-red-500 ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">
              🛒 Сагс хоосон байна.
            </p>
          )}
        </div>

        {/* Total + Checkout */}
        {cartItems.length > 0 && (
          <div className="pt-4 border-t border-gray-800">
            <div className="flex justify-between text-lg font-semibold mb-4">
              <span>Захиалгын дүн</span>
              <span className="text-[#facc15]">
                ₮{totalPrice.toLocaleString()}
              </span>
            </div>
            <Button
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#facc15] to-[#fbbf24] text-black font-semibold text-lg hover:brightness-110 transition-all"
              onClick={() => {
                if (totalPrice <= 0) return toast.error("Сагс хоосон байна.");
                setShowPaymentDialog(true);
              }}
              disabled={isSubmitting || totalPrice <= 0}
            >
              {isSubmitting ? "Обрабатывается..." : "Захиалах"}
            </Button>
          </div>
        )}
      </div>

      <SheetFooter />

      {orderId && (
        <QPayDialog
          open={showPaymentDialog}
          onOpenChange={setShowPaymentDialog}
          amount={totalPrice}
          orderId={orderId}
          onSuccess={() => setPaymentDone(true)}
        />
      )}
    </>
  );
};
