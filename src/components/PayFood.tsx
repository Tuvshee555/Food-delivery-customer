"use client";

import React, { useEffect, useState } from "react";
import { SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@/app/provider/AuthProvider";
import { AddLocation } from "./AddLocation";
import { QPayDialog } from "@/app/qpay/page";

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
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  // 🛒 Load cart from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(storedCart);

    const total = storedCart.reduce(
      (sum: number, item: CartItemType) =>
        sum + item.food.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, []);

  // ✅ Only called AFTER payment success
  const postFoodItems = async () => {
    if (!userId) {
      toast.error("User not authenticated!");
      return;
    }

    if (!cartItems.length) {
      toast.error("Your cart is empty.");
      return;
    }

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
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order`,
        { userId, items: normalizedItems, totalPrice, location },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Order created:", response.data);
      toast.success("Order placed successfully!");
      localStorage.removeItem("cart");
      setCartItems([]);
      setTotalPrice(0);
    } catch (error) {
      console.error("❌ Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔁 Trigger order placement automatically once payment is confirmed
  useEffect(() => {
    if (paymentDone) {
      postFoodItems();
    }
  }, [paymentDone]);

  return (
    <>
      {/* Address Dialog */}
      <AddLocation
        open={locationDialogOpen}
        onOpenChange={setLocationDialogOpen}
      />

      {/* Cart Section */}
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
                  className="w-[64px] h-[64px] rounded-lg object-cover"
                  alt={item.food.foodName}
                />
                <div className="flex flex-col flex-1 ml-4">
                  <span className="text-red-500 font-semibold text-base">
                    {item.food.foodName}
                  </span>
                  <span className="text-gray-600 text-sm">
                    x{item.quantity}
                  </span>
                </div>
                <span className="font-semibold text-lg">
                  ₮{(item.food.price * item.quantity).toFixed(2)}
                </span>
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

      {/* Checkout Button */}
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

      {/* QPay Dialog */}
      <QPayDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        amount={totalPrice}
        onSuccess={() => setPaymentDone(true)} // ✅ callback when paid
      />
    </>
  );
};
