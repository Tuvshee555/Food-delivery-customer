/* eslint-disable @next/next/no-img-element */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { FoodType } from "@/type/type";

const getMediaUrl = (media?: string | File): string => {
  if (!media) return "/placeholder.png";
  return typeof media === "string" ? media : URL.createObjectURL(media);
};

export const FoodMedia = ({ food }: { food: FoodType }) => {
  const mediaList = useMemo(() => {
    const list: { type: "image" | "video"; src: string }[] = [];

    if (food.image) {
      list.push({ type: "image", src: getMediaUrl(food.image) });
    }

    if (Array.isArray(food.extraImages)) {
      food.extraImages.forEach((img) =>
        list.push({ type: "image", src: getMediaUrl(img) })
      );
    }

    if (food.video) {
      list.push({
        type: "video",
        src:
          typeof food.video === "string"
            ? food.video
            : URL.createObjectURL(food.video),
      });
    }

    return list;
  }, [food]);

  const [activeIndex, setActiveIndex] = useState(0);
  const active = mediaList[activeIndex];

  useEffect(() => {
    return () => {
      mediaList.forEach((m) => {
        if (m.src.startsWith("blob:")) {
          try {
            URL.revokeObjectURL(m.src);
          } catch {}
        }
      });
    };
  }, [mediaList]);

  return (
    <div className="w-full">
      {/* MAIN MEDIA */}
      <div
        className="
          relative
          w-full
          h-[320px] sm:h-[380px] lg:h-[460px]
          bg-muted
          rounded-xl
          overflow-hidden
          border border-border
        "
      >
        <AnimatePresence mode="wait">
          {active.type === "image" ? (
            <motion.img
              key={active.src}
              src={active.src}
              alt={food.foodName}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
          ) : (
            <motion.video
              key={active.src}
              src={active.src}
              controls
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* THUMBNAILS */}
      {mediaList.length > 1 && (
        <div className="flex gap-3 mt-3 overflow-x-auto">
          {mediaList.map((m, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`
                w-14 h-14
                rounded-md
                overflow-hidden
                border
                ${i === activeIndex ? "border-primary" : "border-border"}
                flex-shrink-0
              `}
            >
              {m.type === "image" ? (
                <img
                  src={m.src}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <video src={m.src} className="w-full h-full object-cover" />
              )}

              {m.type === "video" && (
                <span className="absolute inset-0 flex items-center justify-center text-white text-xs bg-black/40">
                  ▶
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
