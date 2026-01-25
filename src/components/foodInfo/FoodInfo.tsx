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
      (c) => c.foodId === item.foodId && c.selectedSize === item.selectedSize,
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

const BESTSELLER_THRESHOLD = 20;

const formatCount = (n: number) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
};

const Stars = ({ value }: { value: number }) => {
  const full = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <div className="flex items-center gap-1 leading-none">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={
            i < full
              ? "text-yellow-500 text-sm"
              : "text-muted-foreground text-sm"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
};

export const FoodInfo = ({ food }: { food: any }) => {
  const router = useRouter();
  const { locale, t } = useI18n();

  const isFeatured = Boolean(food.isFeatured);
  const salesCount = Number(food.salesCount ?? 0);
  console.log(salesCount);
  const discount = Number(food.discount ?? 0);
  const hasDiscount = discount > 0;

  const avgRating = Number(food.avgRating ?? 0);
  const reviewCount = Number(food.reviewCount ?? 0);

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
      className="flex flex-col min-h-full gap-5 text-foreground"
    >
      <FoodTitle
        name={food.foodName}
        price={food.price}
        oldPrice={food.oldPrice}
      />

      {/* ✅ Rating + Bought count (Vitals style) */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {reviewCount > 0 ? (
          <div className="flex items-center gap-2">
            <Stars value={avgRating} />
            <span className="font-medium text-foreground">
              {avgRating.toFixed(1)}
            </span>
            <span>
              ({reviewCount} {t("reviews") ?? "reviews"})
            </span>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">
            {t("no_reviews") ?? "No reviews yet"}
          </div>
        )}

        <span className="hidden sm:inline">•</span>

        {salesCount > 0 && (
          <span>
            {formatCount(salesCount)} {t("times_bought") ?? "bought"}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {isFeatured && (
          <span className="inline-flex items-center text-xs font-semibold px-2 py-1 rounded-sm bg-red-600 text-white">
            {t("featured")}
          </span>
        )}

        {!isFeatured && salesCount >= BESTSELLER_THRESHOLD && (
          <span className="inline-flex items-center text-xs font-semibold px-2 py-1 rounded-sm bg-muted text-foreground border border-border">
            {t("bestseller")}
          </span>
        )}

        {hasDiscount && (
          <span className="inline-flex items-center text-xs font-semibold px-2 py-1 rounded-sm bg-yellow-500 text-black">
            -{discount}%
          </span>
        )}
      </div>

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

      <div className="mt-auto">
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
