/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FoodType } from "@/type/type";

const getMediaUrl = (media?: string | File): string => {
  if (!media) return "/placeholder.png";
  return typeof media === "string" ? media : URL.createObjectURL(media);
};

export const FoodMedia = ({ food }: { food: FoodType }) => {
  const [mainMedia, setMainMedia] = useState({
    type: "image" as "image" | "video",
    src: getMediaUrl(food.image),
  });

  const extraImages =
    Array.isArray(food.extraImages) && food.extraImages.length > 0
      ? food.extraImages.map(getMediaUrl)
      : [];

  const videoSrc =
    typeof food.video === "string"
      ? food.video
      : food.video
      ? URL.createObjectURL(food.video)
      : undefined;

  return (
    <>
      {/* Thumbnails */}
      <div className="flex lg:flex-col gap-3 w-full lg:w-[130px] overflow-x-auto lg:overflow-y-auto scrollbar-hide">
        {[getMediaUrl(food.image), ...extraImages].map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`img-${i}`}
            onClick={() => setMainMedia({ type: "image", src: img })}
            className={`w-24 h-24 object-cover rounded-xl border ${
              mainMedia.src === img ? "border-[#facc15]" : "border-gray-700"
            } hover:border-[#facc15] transition cursor-pointer`}
          />
        ))}
        {videoSrc && (
          <div
            onClick={() => setMainMedia({ type: "video", src: videoSrc })}
            className={`w-24 h-24 rounded-xl border flex items-center justify-center ${
              mainMedia.src === videoSrc
                ? "border-[#facc15]"
                : "border-gray-700"
            } hover:border-[#facc15] transition-all bg-black relative cursor-pointer`}
          >
            <video
              src={videoSrc}
              className="w-full h-full object-cover rounded-xl opacity-80"
            />
            <span className="absolute text-xs text-white font-semibold bg-black/60 px-2 py-1 rounded">
              ▶ Video
            </span>
          </div>
        )}
      </div>

      {/* Main Display */}
      <div className="flex-1 flex justify-center items-center bg-[#111] rounded-3xl border border-gray-800 p-5 md:p-8 shadow-[0_0_40px_-10px_rgba(250,204,21,0.15)]">
        {mainMedia.type === "image" ? (
          <motion.img
            key={mainMedia.src}
            src={mainMedia.src}
            alt={food.foodName}
            className="object-contain w-full h-[400px] md:h-[520px] rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        ) : (
          <video
            src={mainMedia.src}
            controls
            className="object-contain w-full h-[400px] md:h-[520px] rounded-xl border border-gray-700"
          />
        )}
      </div>
    </>
  );
};
