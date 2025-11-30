/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { FoodTitle } from "./FoodTitle";
import { FoodSizes } from "./FoodSizes";
import { FoodQuantity } from "./FoodQuantity";
import { FoodActions } from "./FoodActions";
import { FoodAddress } from "./FoodAddress";

import { addToCartLocal } from "./utils/addToCartLocal";
import { addToCartServer } from "./utils/addToCartServer";
import { resolveImageUrl } from "./utils/resolveImageUrl";

import { useAuth } from "@/app/[locale]/provider/AuthProvider";
import { useCart } from "@/app/[locale]/store/cartStore";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

export const FoodInfo = ({
  food,
  address,
}: {
  food: any;
  address: string | null;
}) => {
  const router = useRouter();
  const { locale, t } = useI18n();
  const { userId, token } = useAuth();
  const { add } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPrice = food.price * quantity;

  const handleAddToCart = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    if (userId && token) {
      const ok = await addToCartServer({
        foodId: food.id,
        userId,
        token,
        quantity,
        selectedSize,
      });

      if (ok) {
        add({
          foodId: food.id,
          quantity,
          selectedSize,
          food: {
            id: food.id,
            foodName: food.foodName,
            price: food.price,
            image: resolveImageUrl(food.image),
          },
        });
      }
    } else {
      addToCartLocal({ food, quantity, selectedSize });
    }

    setIsProcessing(false);
  };

  const handleOrderNow = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    let ok = true;

    if (userId && token) {
      ok = await addToCartServer({
        foodId: food.id,
        userId,
        token,
        quantity,
        selectedSize,
      });
    } else {
      ok = addToCartLocal({ food, quantity, selectedSize });
    }

    if (!ok) {
      setIsProcessing(false);
      return;
    }

    if (!userId || !token) {
      router.push(`/${locale}/sign-in?redirect=/${locale}/checkout`);
      setIsProcessing(false);
      return;
    }

    router.push(`/${locale}/checkout`);
    setIsProcessing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col gap-8 bg-gradient-to-b from-[#111] to-[#0a0a0a]
      border border-gray-800 rounded-3xl p-8 md:p-10
      shadow-[0_0_40px_-10px_rgba(250,204,21,0.1)]"
    >
      <FoodTitle name={food.foodName} totalPrice={totalPrice} />

      {food.ingredients && (
        <div>
          <h3 className="text-gray-400 mb-2 text-sm uppercase tracking-wide">
            {t("ingredients")}
          </h3>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            {food.ingredients}
          </p>
        </div>
      )}

      <FoodSizes
        sizes={food.sizes || []}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
      />

      <FoodQuantity quantity={quantity} setQuantity={setQuantity} />

      <FoodActions
        onAddToCart={handleAddToCart}
        onOrderNow={handleOrderNow}
        isProcessing={isProcessing}
        addText={t("add_to_cart")}
        orderText={t("order_now")}
      />

      <FoodAddress foodName={food.foodName} address={address} />
    </motion.div>
  );
};
