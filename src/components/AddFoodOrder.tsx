/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Minus } from "lucide-react";
import { toast } from "sonner";

// Define food type
export type FoodType = {
  _id: string;
  foodName: string;
  ingredients: string;
  price: number;
  image: string;
};

// Props type
export type AddFoodOrderProps = {
  food: FoodType;
};

export const AddFoodOrder: React.FC<AddFoodOrderProps> = ({ food }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [address, setAddress] = useState<string | null>(null);

  // Load user address from localStorage
  useEffect(() => {
    const storedAddress = localStorage.getItem("address");
    setAddress(storedAddress);
  }, []);

  const handleIncrease = (): void => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = (): void => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const createOrder = async () => {
    if (
      !address ||
      address.trim() === "" ||
      address === "null" ||
      address === "undefined"
    ) {
      toast.error("❌ No address provided! Please add a delivery address.");
      return;
    }

    try {
      const cart = localStorage.getItem("cart");
      const newItem = { food, quantity };

      if (cart) {
        const cartItems = JSON.parse(cart) as {
          food: FoodType;
          quantity: number;
        }[];
        cartItems.push(newItem);
        localStorage.setItem("cart", JSON.stringify(cartItems));
      } else {
        localStorage.setItem("cart", JSON.stringify([newItem]));
      }

      toast.success("✅ Successfully added to cart");
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to add order");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="absolute bottom-2 right-2 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg hover:cursor-pointer">
          <Plus className="text-red-500" />
        </div>
      </DialogTrigger>

      <DialogContent className="w-[826px] h-[412px] p-0 flex overflow-hidden rounded-lg">
        {/* Food Image */}
        <div className="w-[377px] h-[412px]">
          <img
            className="w-full h-full object-cover"
            src={food.image}
            alt={food.foodName}
          />
        </div>

        {/* Food Info */}
        <div className="flex flex-col flex-1 p-[26px]">
          <div className="flex flex-col justify-between h-[300px]">
            <div>
              <DialogTitle className="text-red-500 text-lg font-semibold">
                {food.foodName}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {food.ingredients}
              </DialogDescription>
            </div>

            <div className="flex flex-col gap-6 mt-6">
              <div>
                <h3 className="text-gray-600 text-sm">Total price</h3>
                <h2 className="text-xl font-semibold">
                  ${(Number(food.price) * quantity).toFixed(2)}
                </h2>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleDecrease}
                  className="border border-gray-400 rounded-full p-2 hover:bg-gray-100"
                >
                  <Minus />
                </button>
                <span className="text-lg font-semibold">{quantity}</span>
                <button
                  onClick={handleIncrease}
                  className="border border-gray-400 rounded-full p-2 hover:bg-gray-100"
                >
                  <Plus />
                </button>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-auto">
            <Button
              className="bg-black text-white rounded-lg w-full p-3"
              onClick={createOrder}
            >
              Add to cart
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
