"use client";

import { useState } from "react";
import { FoodType } from "@/type/type";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ShareButton } from "@/components/ShareButton";
import { useAuth } from "@/app/provider/AuthProvider";

export const FoodInfo = ({
  food,
  address,
}: {
  food: FoodType;
  address: string | null;
}) => {
  const router = useRouter();
  const { userId, token } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPrice = food.price * quantity;

  const resolveImageUrl = () =>
    typeof food.image === "string"
      ? food.image
      : food.image
      ? URL.createObjectURL(food.image as Blob)
      : "";

  const getFoodId = () => food.id || food._id || null;

  // ----------------------------------------------------------------------
  // 🛒 ADD TO SERVER CART
  // ----------------------------------------------------------------------
  const addToCartServer = async (gotoCheckout = false) => {
    if (!userId || !token) {
      toast.error("❌ Нэвтэрч ороогүй байна. Эхлээд нэвтэрнэ үү.");
      return false;
    }

    if (!address) {
      toast.error("📍 Та эхлээд хаягаа оруулна уу.");
      return false;
    }

    // Only check if sizes exist
    if (Array.isArray(food.sizes) && food.sizes.length > 0 && !selectedSize) {
      toast.error("⚠️ Хэмжээг сонгоно уу.");
      return false;
    }

    const foodId = getFoodId();
    if (!foodId) {
      toast.error("❌ Хоолны ID олдсонгүй.");
      return false;
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
            selectedSize,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "❌ Сагс руу нэмэхэд алдаа гарлаа.");
        return false;
      }

      toast.success("🛒 Амжилттай сагсанд нэмэгдлээ!");

      if (gotoCheckout) {
        setTimeout(() => router.push("/checkout"), 200);
      }

      return true;
    } catch (error) {
      console.error(error);
      toast.error("❌ Сервертэй холбогдож чадсангүй.");
      return false;
    }
  };

  // ----------------------------------------------------------------------
  // BUTTON HANDLERS
  // ----------------------------------------------------------------------
  const handleAddToCart = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    await addToCartServer(false);
    setIsProcessing(false);
  };

  const handleOrderNow = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    await addToCartServer(true);
    setIsProcessing(false);
  };

  // ----------------------------------------------------------------------
  // UI
  // ----------------------------------------------------------------------
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col gap-8 bg-gradient-to-b from-[#111] to-[#0a0a0a] border border-gray-800 rounded-3xl p-8 md:p-10 shadow-[0_0_40px_-10px_rgba(250,204,21,0.1)]"
    >
      {/* Title + Price */}
      <div className="border-b border-gray-800 pb-4">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
          {food.foodName}
        </h1>
        <p className="text-3xl font-semibold text-[#facc15]">
          {totalPrice.toLocaleString()}₮
        </p>
      </div>

      {/* Ingredients */}
      {food.ingredients && (
        <div>
          <h3 className="text-gray-400 mb-2 text-sm uppercase tracking-wide">
            Орц:
          </h3>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            {food.ingredients}
          </p>
        </div>
      )}

      {/* Sizes */}
      {Array.isArray(food.sizes) && food.sizes.length > 0 && (
        <div>
          <h3 className="text-gray-400 mb-3 text-sm uppercase">Хэмжээ:</h3>
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
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={i}
                  onClick={() => setSelectedSize(label)}
                  className={`px-5 py-2 rounded-full font-medium text-sm transition-all ${
                    active
                      ? "bg-[#facc15] text-black shadow-[0_0_15px_rgba(250,204,21,0.3)]"
                      : "bg-[#1a1a1a] text-gray-300 border border-gray-700 hover:border-[#facc15]"
                  }`}
                >
                  {label}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity Controls */}
      <div className="flex items-center gap-6 mt-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] border border-gray-700 text-xl hover:border-[#facc15] hover:text-[#facc15] transition"
        >
          −
        </motion.button>

        <span className="text-2xl font-semibold text-gray-100">{quantity}</span>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setQuantity((q) => q + 1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] border border-gray-700 text-xl hover:border-[#facc15] hover:text-[#facc15] transition"
        >
          +
        </motion.button>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          disabled={isProcessing}
          className="flex-1 py-4 rounded-2xl bg-[#111] border border-gray-700 text-white font-semibold text-lg hover:border-[#facc15] transition-all disabled:opacity-60"
        >
          🛒 Сагсанд нэмэх
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleOrderNow}
          disabled={isProcessing}
          className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#facc15] to-[#fbbf24] text-black font-semibold text-lg shadow-[0_0_25px_rgba(250,204,21,0.4)] hover:brightness-110 transition-all disabled:opacity-60"
        >
          Захиалах
        </motion.button>
      </div>

      {/* Address + Share */}
      <div className="flex justify-between items-center text-gray-400 text-sm pt-5 border-t border-gray-800 mt-6">
        <span className="truncate max-w-[65%]">
          📍 Хаяг:{" "}
          <span className="text-gray-300">
            {address || "Хаяг оруулаагүй байна"}
          </span>
        </span>
        <ShareButton title={food.foodName} />
      </div>
    </motion.div>
  );
};
