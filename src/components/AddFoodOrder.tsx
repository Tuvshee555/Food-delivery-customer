"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Minus } from "lucide-react";
import { AddFoodOrderProps } from "@/type/type";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAuth } from "@/app/provider/AuthProvider";

export const AddFoodOrder: React.FC<AddFoodOrderProps> = ({ food }) => {
  const { userId, token } = useAuth();
  const [quantity, setQuantity] = useState<number>(1);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    setAddress(localStorage.getItem("address")); // delivery address saved by AddLocation modal
  }, []);

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => quantity > 1 && setQuantity((prev) => prev - 1);

  // --------------------------------------------------------------------
  // 🛒 Add to SERVER CART
  // --------------------------------------------------------------------
  const createOrder = async () => {
    if (!userId) {
      toast.error("❌ Please login first.");
      return;
    }

    if (!address || address.trim() === "") {
      toast.error("❌ Please add a delivery address.");
      return;
    }

    const foodId = food.id || food.id;
    if (!foodId) {
      toast.error("❌ Invalid food item.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId,
            foodId,
            quantity,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "❌ Failed to add item.");
        return;
      }

      toast.success("✅ Added to cart!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to add item.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center 
          rounded-full bg-white/80 backdrop-blur-md shadow-lg hover:bg-white hover:shadow-xl 
          cursor-pointer transition-all"
        >
          <Plus className="text-red-500" />
        </motion.div>
      </DialogTrigger>

      <DialogContent
        className="w-full max-w-[820px] md:h-[420px] h-auto p-0 flex flex-col md:flex-row
        overflow-hidden rounded-2xl bg-white/90 backdrop-blur-lg shadow-2xl border border-gray-200"
      >
        {/* Image */}
        <div className="md:w-[380px] h-[260px] md:h-auto">
          <img
            className="w-full h-full object-cover"
            src={typeof food.image === "string" ? food.image : ""}
            alt={food.foodName}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6 justify-between">
          <div>
            <DialogTitle className="text-red-500 text-2xl font-semibold mb-2">
              {food.foodName}
            </DialogTitle>
            <p className="text-gray-600 text-sm leading-relaxed">
              {food.ingredients}
            </p>
          </div>

          {/* Price + Quantity */}
          <div className="flex flex-col gap-6 mt-6">
            <div>
              <h3 className="text-gray-600 text-sm">Total price</h3>
              <h2 className="text-2xl font-semibold text-gray-900">
                ₮{(food.price * quantity).toLocaleString()}
              </h2>
            </div>

            <div className="flex items-center gap-6">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleDecrease}
                className="border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition"
              >
                <Minus />
              </motion.button>

              <span className="text-lg font-semibold">{quantity}</span>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleIncrease}
                className="border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition"
              >
                <Plus />
              </motion.button>
            </div>
          </div>

          <DialogFooter className="mt-8">
            <Button
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 
              hover:to-orange-600 text-white text-base font-medium rounded-xl w-full py-3 
              transition-all shadow-md hover:shadow-lg"
              onClick={createOrder}
            >
              Add to Cart
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
