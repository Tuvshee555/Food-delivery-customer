"use client";

import React, { useEffect, useState, useCallback } from "react";
import { SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/app/provider/AuthProvider";
import { AddLocation } from "./AddLocation";
import { QPayDialog } from "@/app/qpay/QPayDialog";

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

  const calculateTotal = useCallback((items: CartItemType[]) => {
    return items.reduce(
      (sum, item) => sum + item.food.price * item.quantity,
      0
    );
  }, []);

  useEffect(() => {
    try {
      const storedCart: CartItemType[] = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );
      setCartItems(storedCart);
      setTotalPrice(calculateTotal(storedCart));

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

      toast.success("Order placed successfully!");
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

      <div className="w-full bg-white rounded-[10px] p-[16px] shadow-lg">
        <h1 className="text-lg font-semibold mb-4">My Cart</h1>
        <div className="mt-2 space-y-4 max-h-[300px] overflow-y-auto">
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-4"
              >
                <img
                  src={item.food.image}
                  alt={item.food.foodName}
                  className="w-[64px] h-[64px] rounded-lg object-cover"
                />
                <div className="flex flex-col flex-1 ml-4">
                  <span className="text-red-500 font-semibold text-base">
                    {item.food.foodName}
                  </span>
                  <span className="text-gray-600 text-sm">
                    x{item.quantity}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-lg">
                    ₮{(item.food.price * item.quantity).toFixed(2)}
                  </span>
                  <Button
                    className="text-gray-400 hover:text-red-500"
                    onClick={() => removeCartItem(index)}
                  >
                    ✕
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">Your cart is empty</p>
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="mt-6 flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>₮{totalPrice.toFixed(2)}</span>
          </div>
        )}
      </div>

      <SheetFooter className="mt-4">
        <Button
          className="bg-red-500 text-white w-full rounded-lg py-3 text-lg font-semibold"
          onClick={() => {
            if (totalPrice <= 0) return toast.error("Cart is empty.");
            setShowPaymentDialog(true);
          }}
          disabled={isSubmitting || totalPrice <= 0}
        >
          {isSubmitting ? "Processing..." : "Proceed to Checkout"}
        </Button>
      </SheetFooter>

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
