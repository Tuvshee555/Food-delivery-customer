/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { FoodTitle } from "./FoodTitle";
import { FoodSizes } from "./FoodSizes";
import { FoodQuantity } from "./FoodQuantity";
import { FoodActions } from "./FoodActions";

import { resolveImageUrl } from "./utils/resolveImageUrl";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

type LocalCartItem = {
  foodId: string;
  quantity: number;
  selectedSize?: string | null;
  food: {
    id: string;
    foodName: string;
    price: number;
    image: string;
  };
};

const CART_KEY = "cart";

const addToCartLocal = (item: LocalCartItem): boolean => {
  try {
    const raw = localStorage.getItem(CART_KEY) || "[]";
    const cart: LocalCartItem[] = JSON.parse(raw);

    const index = cart.findIndex(
      (c) => c.foodId === item.foodId && c.selectedSize === item.selectedSize
    );

    if (index >= 0) {
      cart[index].quantity += item.quantity;
    } else {
      cart.push(item);
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
    return true;
  } catch {
    return false;
  }
};

export const FoodInfo = ({ food }: { food: any }) => {
  const router = useRouter();
  const { locale, t } = useI18n();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const buildCartItem = (): LocalCartItem => ({
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

  const handleAddToCart = () => {
    if (isProcessing) return;
    setIsProcessing(true);

    addToCartLocal(buildCartItem());

    setIsProcessing(false);
  };

  const handleOrderNow = () => {
    if (isProcessing) return;
    setIsProcessing(true);

    const ok = addToCartLocal(buildCartItem());
    if (!ok) {
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
      className="flex flex-col gap-8 text-foreground"
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

      <div className={food.sizes?.length ? "" : "lg:mt-[98px]"}>
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
      </div>
    </motion.div>
  );
};
