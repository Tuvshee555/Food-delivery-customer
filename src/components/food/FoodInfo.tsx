"use client";

import { useState } from "react";
import { FoodType } from "@/type/type";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ShareButton } from "@/components/ShareButton";

export const FoodInfo = ({
  food,
  address,
}: {
  food: FoodType;
  address: string | null;
}) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const totalPrice = food.price * quantity;

  const handleAddToCart = () => {
    if (!address) {
      toast.error("📍 Please add your address first.");
      return;
    }

    if (Array.isArray(food.sizes) && food.sizes.length > 0 && !selectedSize) {
      toast.error("⚠️ Please select a size before ordering.");
      return;
    }

    const imageUrl =
      typeof food.image === "string"
        ? food.image
        : food.image
        ? URL.createObjectURL(food.image as Blob)
        : "";

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const newItem = {
      food: {
        _id: food._id,
        foodName: food.foodName,
        price: food.price,
        image: imageUrl,
      },
      quantity,
      selectedSize,
      address,
    };

    localStorage.setItem("cart", JSON.stringify([...cart, newItem]));
    toast.success("✅ Added to cart!");
    setTimeout(() => router.push("/checkout"), 800);
  };

  return (
    <div className="flex-1 flex flex-col gap-6 bg-[#0e0e0e]/90 border border-gray-800 rounded-3xl p-6 md:p-8 shadow-lg backdrop-blur-md">
      <div className="border-b border-gray-800 pb-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          {food.foodName}
        </h1>
        <p className="text-3xl font-semibold text-[#facc15]">
          {totalPrice.toLocaleString()}₮
        </p>
      </div>

      {food.ingredients && (
        <div>
          <h3 className="text-gray-400 mb-2 text-sm uppercase tracking-wide">
            Орц:
          </h3>
          <p className="text-gray-300 text-sm md:text-base">
            {food.ingredients}
          </p>
        </div>
      )}

      {Array.isArray(food.sizes) && food.sizes.length > 0 && (
        <div>
          <h3 className="text-gray-400 mb-2 text-sm uppercase">Хэмжээ:</h3>
          <div className="flex flex-wrap gap-3">
            {food.sizes.map((s: any, i: number) => {
              const label =
                typeof s === "string"
                  ? s
                  : typeof s === "object" && "label" in s
                  ? s.label
                  : "";
              const active = selectedSize === label;

              return (
                <button
                  key={i}
                  onClick={() => setSelectedSize(label)}
                  className={`px-4 py-2 rounded-full font-medium text-sm ${
                    active
                      ? "bg-[#facc15] text-black"
                      : "bg-[#1a1a1a] text-gray-300 border border-gray-700 hover:border-[#facc15]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="flex items-center gap-6 mt-1">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="w-9 h-9 rounded-full bg-[#1a1a1a] border border-gray-700 text-lg hover:border-[#facc15]"
        >
          −
        </motion.button>
        <span className="text-xl font-semibold">{quantity}</span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setQuantity((q) => q + 1)}
          className="w-9 h-9 rounded-full bg-[#1a1a1a] border border-gray-700 text-lg hover:border-[#facc15]"
        >
          +
        </motion.button>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleAddToCart}
        className="mt-4 py-4 rounded-xl bg-gradient-to-r from-[#facc15] to-[#fbbf24] text-black font-semibold text-lg shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:brightness-110 transition-all"
      >
        Захиалах
      </motion.button>

      <div className="flex justify-between items-center text-gray-400 text-sm pt-5 border-t border-gray-800">
        <span className="truncate max-w-[60%]">
          📍 Хаяг: {address || "Хаяг оруулаагүй байна"}
        </span>
        <ShareButton title={food.foodName} />
      </div>
    </div>
  );
};
