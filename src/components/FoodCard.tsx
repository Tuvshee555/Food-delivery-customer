/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import Link from "next/link";
import { FoodCardPropsType } from "@/type/type";
import { motion, AnimatePresence } from "framer-motion";

export const FoodCard: React.FC<FoodCardPropsType> = ({ food }) => {
  const [hoverIndex, setHoverIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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
    const index = Math.min(displayImages.length - 1, Math.floor(x / zoneWidth));
    setHoverIndex(index);
  };

  return (
    <Link
      href={`/food/${food.id || food._id}`}
      className="block w-full max-w-[280px]"
    >
      <div
        className="overflow-hidden relative bg-transparent cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setHoverIndex(0);
        }}
        onMouseMove={handleMouseMove}
      >
        {/* 🖼 Product image with smooth transition */}
        <div className="relative w-full h-[240px] overflow-hidden select-none rounded-[10px]">
          <AnimatePresence mode="wait">
            <motion.img
              key={hoverIndex}
              src={displayImages[hoverIndex]}
              alt={food.foodName}
              className="absolute inset-0 w-full h-full object-cover rounded-[10px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
              draggable={false}
            />
          </AnimatePresence>

          {/* ⚪ Bottom image indicators — only visible on hover */}
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
                  className={`h-[3px] flex-1 transition-all duration-200 ${
                    i === hoverIndex ? "bg-white" : "bg-white/30"
                  }`}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* 🧾 Info text (left aligned, tight spacing) */}
        <div className="pt-2 flex flex-col items-start text-left">
          <h3 className="text-white font-medium text-[15px] leading-tight line-clamp-2">
            {food.foodName}
          </h3>
          <p className="text-white font-semibold text-[14px] mt-[1px]">
            {food.price?.toLocaleString()}₮
          </p>
        </div>

        {/* SOLD OUT overlay */}
        {food.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-semibold text-lg rounded-[10px]">
            Дууссан
          </div>
        )}
      </div>
    </Link>
  );
};
