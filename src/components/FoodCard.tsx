/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FoodCardPropsType } from "@/type/type";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

export const FoodCard: React.FC<FoodCardPropsType> = ({ food }) => {
  const [hoverIndex, setHoverIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { locale, t } = useI18n();

  // thresholds / config
  const BESTSELLER_THRESHOLD = 20;

  // data parsing (robust to string or undefined)
  const price = Number((food as any)?.price ?? NaN);
  const oldPriceRaw = (food as any)?.oldPrice;
  const oldPrice =
    typeof oldPriceRaw !== "undefined" && oldPriceRaw !== null
      ? Number(oldPriceRaw)
      : undefined;
  const discountRaw = (food as any)?.discount;
  const discount =
    typeof discountRaw !== "undefined" && discountRaw !== null
      ? Number(discountRaw)
      : undefined;
  const isFeatured = Boolean((food as any)?.isFeatured);
  const salesCount = Number((food as any)?.salesCount ?? 0);
  const isDiscountFake = Boolean((food as any)?.isDiscountFake); // optional field (if you add it in backend later)

  // computed values
  const hasDiscount =
    !Number.isNaN(discount) && typeof discount === "number" && discount > 0;
  const showOldPrice =
    typeof oldPrice === "number" &&
    !Number.isNaN(oldPrice) &&
    oldPrice > 0 &&
    oldPrice > price;
  const savings =
    showOldPrice && !Number.isNaN(price)
      ? Number((oldPrice! - price).toFixed(2))
      : undefined;

  const getMediaUrl = (media?: string | File): string => {
    if (!media) return "/placeholder.png";
    return typeof media === "string" ? media : URL.createObjectURL(media);
  };

  const images: string[] = [
    getMediaUrl(food.image),
    ...(Array.isArray(food.extraImages)
      ? food.extraImages.map((img: string | File) => getMediaUrl(img))
      : []),
  ];
  const displayImages = images.slice(0, 3);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (displayImages.length <= 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const zoneWidth = rect.width / displayImages.length;
    setHoverIndex(
      Math.min(displayImages.length - 1, Math.floor(x / zoneWidth))
    );
  };

  // formatting helpers
  const fmt = (v: number) =>
    Number.isNaN(v)
      ? "-"
      : v.toLocaleString(undefined, { maximumFractionDigits: 2 });

  return (
    <Link href={`/${locale}/food/${food.id}`} className="block w-full">
      <div
        className="overflow-hidden relative bg-transparent cursor-pointer w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setHoverIndex(0);
        }}
        onMouseMove={handleMouseMove}
      >
        <div className="relative w-full aspect-[4/3] overflow-hidden select-none rounded-[10px]">
          {/* Badges stack */}
          <div className="absolute top-3 left-3 z-30 flex flex-col gap-2">
            {isFeatured && (
              <div className="inline-flex items-center text-xs font-semibold px-2 py-1 bg-red-600 text-white rounded-sm -rotate-6 shadow">
                Онцлох
              </div>
            )}

            {!isFeatured && salesCount >= BESTSELLER_THRESHOLD && (
              <div className="inline-flex items-center text-xs font-semibold px-2 py-1 bg-black text-white rounded-sm -rotate-6 shadow">
                Бестселлер
              </div>
            )}

            {hasDiscount && (
              <div
                className={`inline-flex items-center text-xs font-semibold px-2 py-1 rounded-sm -rotate-6 shadow
                  ${
                    isDiscountFake
                      ? "bg-yellow-400 text-black"
                      : "bg-yellow-500 text-black"
                  }`}
                title={
                  isDiscountFake
                    ? "Marked as promotional / not guaranteed"
                    : "Discount"
                }
              >
                -{discount}%{isDiscountFake ? " (promo)" : ""}
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.img
              key={hoverIndex}
              src={displayImages[hoverIndex]}
              alt={food.foodName}
              className="absolute inset-0 w-full h-full object-cover rounded-[10px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              draggable={false}
            />
          </AnimatePresence>

          {/* Hover indicator bars */}
          {displayImages.length > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 left-0 w-full flex justify-between"
            >
              {displayImages.map((_, i) => (
                <div
                  key={i}
                  className={`h-[3px] flex-1 transition ${
                    i === hoverIndex ? "bg-white" : "bg-white/30"
                  }`}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* Info */}
        <div className="pt-2 flex flex-col items-start text-left w-full">
          <h3 className="text-white font-medium text-[15px] leading-tight line-clamp-2">
            {food.foodName}
          </h3>

          <div className="mt-[6px] flex items-baseline gap-3">
            {/* Price area */}
            <div className="flex items-center gap-2">
              <p className="text-white font-semibold text-[14px]">
                {Number.isNaN(price) ? "-" : `${fmt(price)}₮`}
              </p>

              {showOldPrice && (
                <p className="text-gray-300 text-sm line-through text-[13px]">
                  {fmt(oldPrice!)}₮
                </p>
              )}

              {savings !== undefined && savings > 0 && (
                <p className="text-green-300 text-sm font-medium text-[12px]">
                  Save {fmt(savings)}₮
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sold out overlay */}
        {food.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-semibold text-lg rounded-[10px]">
            {t("sold_out")}
          </div>
        )}
      </div>
    </Link>
  );
};
