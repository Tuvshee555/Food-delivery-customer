/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import type { FoodCardPropsType } from "@/type/type";

export const FoodCard: React.FC<FoodCardPropsType> = ({ food }) => {
  const { locale, t } = useI18n();
  const [hoverIndex, setHoverIndex] = useState(0);

  const BESTSELLER_THRESHOLD = 20;

  const price = Number((food as any)?.price ?? NaN);
  const oldPrice = Number((food as any)?.oldPrice ?? NaN);
  const discount = Number((food as any)?.discount ?? NaN);
  const isFeatured = Boolean((food as any)?.isFeatured);
  const salesCount = Number((food as any)?.salesCount ?? 0);
  const isDiscountFake = Boolean((food as any)?.isDiscountFake);

  const hasDiscount = !Number.isNaN(discount) && discount > 0;
  const showOldPrice = !Number.isNaN(oldPrice) && oldPrice > price;
  const savings =
    showOldPrice && !Number.isNaN(price)
      ? Number((oldPrice - price).toFixed(2))
      : undefined;

  const displayImages = useMemo(() => {
    const imgs: string[] = [];
    const push = (m?: string | File) => {
      if (!m) return;
      imgs.push(typeof m === "string" ? m : URL.createObjectURL(m));
    };
    push(food.image);
    if (Array.isArray((food as any)?.extraImages)) {
      (food as any).extraImages.forEach((i: any) => push(i));
    }
    return imgs.slice(0, 3);
  }, [food.image, JSON.stringify((food as any)?.extraImages ?? [])]);

  useEffect(() => {
    return () => {
      displayImages.forEach((u) => {
        if (u.startsWith("blob:")) URL.revokeObjectURL(u);
      });
    };
  }, [displayImages]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (displayImages.length <= 1) return;
    const r = e.currentTarget.getBoundingClientRect();
    const i = Math.floor(
      ((e.clientX - r.left) / r.width) * displayImages.length
    );
    setHoverIndex(Math.min(displayImages.length - 1, Math.max(0, i)));
  };

  const fmt = (v: number) => (Number.isNaN(v) ? "-" : v.toLocaleString());

  const mainImage = displayImages[hoverIndex] ?? "/placeholder.png";

  return (
    <Link
      href={`/${locale}/food/${food.id}`}
      className="block w-full focus:outline-none"
    >
      <div
        className="w-full cursor-pointer transition-transform duration-200"
        onMouseLeave={() => {
          setHoverIndex(0);
        }}
        onMouseMove={handleMouseMove}
      >
        {/* MEDIA (isolated relative box) */}
        <div className="relative w-full aspect-[4/3] rounded-[10px] overflow-hidden bg-muted">
          <AnimatePresence mode="wait">
            <motion.img
              key={mainImage}
              src={mainImage}
              alt={food.foodName || ""}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              draggable={false}
            />
          </AnimatePresence>

          {/* BADGES */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
            {isFeatured && (
              <span className="inline-flex text-xs font-semibold px-2 py-1 bg-red-600 text-white rounded-sm -rotate-6 shadow">
                {t("featured")}
              </span>
            )}

            {!isFeatured && salesCount >= BESTSELLER_THRESHOLD && (
              <span className="inline-flex text-xs font-semibold px-2 py-1 bg-muted text-foreground rounded-sm -rotate-6 shadow">
                {t("bestseller")}
              </span>
            )}

            {hasDiscount && (
              <span
                className={`inline-flex text-xs font-semibold px-2 py-1 rounded-sm -rotate-6 shadow ${
                  isDiscountFake
                    ? "bg-yellow-400 text-black"
                    : "bg-yellow-500 text-black"
                }`}
              >
                -{discount}%
              </span>
            )}
          </div>

          {/* SOLD OUT (only covers image area) */}
          {food.stock === 0 && (
            <div className="absolute inset-0 z-30 bg-black/60 flex items-center justify-center text-white font-semibold rounded-[10px]">
              {t("sold_out")}
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="pt-3 space-y-1">
          <h3 className="text-foreground font-medium text-[15px] line-clamp-2">
            {food.foodName}
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-foreground font-semibold text-sm">
              {fmt(price)}₮
            </span>

            {showOldPrice && (
              <span className="text-muted-foreground text-xs line-through">
                {fmt(oldPrice)}₮
              </span>
            )}

            {savings && savings > 0 && (
              <span className="text-green-400 text-xs font-medium">
                {t("save")} {fmt(savings)}₮
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FoodCard;
