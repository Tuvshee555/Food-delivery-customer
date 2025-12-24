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

export const FoodInfo = ({ food }: { food: any }) => {
  const router = useRouter();
  const { locale, t } = useI18n();
  const { userId, token } = useAuth();
  const { add } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-5 text-foreground"
    >
      <FoodTitle
        name={food.foodName}
        price={food.price}
        oldPrice={food.oldPrice}
      />

      {food.ingredients && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {food.ingredients}
        </p>
      )}

      <FoodSizes
        sizes={food.sizes || []}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
      />

      <FoodQuantity
        quantity={quantity}
        setQuantity={setQuantity}
        buttonClass="
          w-8 h-8
          flex items-center justify-center
          rounded-md
          bg-muted
          text-foreground
        "
        valueClass="
          min-w-[28px]
          text-center
          font-medium
          text-foreground
        "
      />

      <FoodActions
        onAddToCart={handleAddToCart}
        onOrderNow={handleOrderNow}
        isProcessing={isProcessing}
        addText={t("add_to_cart")}
        orderText={t("order_now")}
        primaryClass="
          h-[44px]
          rounded-md
          bg-foreground
          text-background
          text-sm font-medium
        "
        secondaryClass="
          h-[44px]
          rounded-md
          bg-muted
          text-foreground
          text-sm font-medium
        "
      />

      <FoodAddress foodName={food.foodName} />
    </motion.div>
  );
};
