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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="
        flex-1 flex flex-col gap-6
        bg-card text-card-foreground
        border border-border
        rounded-xl
        p-5 sm:p-6 md:p-8
        shadow-[0_10px_32px_-18px_rgba(0,0,0,0.35)]
      "
    >
      {/* TITLE */}
      <FoodTitle
        name={food.foodName}
        price={food.price}
        oldPrice={food.oldPrice}
      />

      {/* INGREDIENTS */}
      {food.ingredients && (
        <div className="space-y-1.5">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {t("ingredients")}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {food.ingredients}
          </p>
        </div>
      )}

      {/* SIZE */}
      <FoodSizes
        sizes={food.sizes || []}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
      />

      {/* QUANTITY – clean & usable */}
      <FoodQuantity
        quantity={quantity}
        setQuantity={setQuantity}
        buttonClass="
          w-8 h-8
          flex items-center justify-center
          border border-border
          rounded-md
          bg-background
          text-foreground
          hover:bg-muted
          transition
        "
        valueClass="
          min-w-[28px]
          text-center
          font-medium
          text-foreground
        "
      />

      {/* ACTION BUTTONS */}
      <FoodActions
        onAddToCart={handleAddToCart}
        onOrderNow={handleOrderNow}
        isProcessing={isProcessing}
        addText={t("add_to_cart")}
        orderText={t("order_now")}
        primaryClass="
          h-[44px]
          rounded-md
          bg-blue-600 hover:bg-blue-700
          text-white
          text-sm font-medium
          transition
        "
        secondaryClass="
          h-[44px]
          rounded-md
          bg-background
          border border-border
          text-foreground
          text-sm font-medium
          hover:bg-muted
          transition
        "
      />

      {/* ADDRESS */}
      <FoodAddress foodName={food.foodName} />
    </motion.div>
  );
};
