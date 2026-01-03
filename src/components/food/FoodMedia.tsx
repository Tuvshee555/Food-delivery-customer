/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { FoodType } from "@/type/type";
import { FoodMediaLightbox } from "./FoodMediaLightbox";
import type { Media } from "./FoodMediaLightbox";

const getMediaUrl = (media?: string | File): string => {
  if (!media) return "/placeholder.png";
  return typeof media === "string" ? media : URL.createObjectURL(media);
};

export const FoodMedia = ({ food }: { food: FoodType }) => {
  const mediaList = useMemo<Media[]>(() => {
    const list: Media[] = [];

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

    return list.length ? list : [{ type: "image", src: "/placeholder.png" }];
  }, [food]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => setActiveIndex(0), [mediaList.length]);

  /* slide width */
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [slideWidth, setSlideWidth] = useState(0);

  useEffect(() => {
    const update = () => {
      setSlideWidth(containerRef.current?.offsetWidth ?? 0);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* touch detection */
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(
      typeof window !== "undefined" &&
        ("ontouchstart" in window || navigator.maxTouchPoints > 0)
    );
  }, []);

  /* cleanup blobs */
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

  /* drag logic */
  const onDragEnd = (
    _: any,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    if (!slideWidth) return;

    let next = activeIndex - Math.round(info.offset.x / slideWidth);

    if (Math.abs(info.velocity.x) > 600) {
      next = activeIndex - Math.sign(info.velocity.x);
    }

    next = Math.max(0, Math.min(mediaList.length - 1, next));
    setActiveIndex(next);
  };

  return (
    <div className="w-full">
      {/* MEDIA */}
      <div
        ref={containerRef}
        className="
          relative w-full
          h-[320px] sm:h-[380px] lg:h-[460px]
          bg-muted
          overflow-hidden
          border border-border
          rounded-none lg:rounded-xl
        "
      >
        <motion.div
          className="flex h-full"
          drag={isTouch ? "x" : false}
          dragConstraints={{
            left: -(slideWidth * (mediaList.length - 1)),
            right: 0,
          }}
          dragElastic={0.2}
          onDragEnd={onDragEnd}
          animate={{ x: -activeIndex * slideWidth }}
          transition={{ type: "spring", stiffness: 300, damping: 35 }}
          style={{ touchAction: "pan-y" }}
        >
          {mediaList.map((m, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-full h-full relative"
              style={{ minWidth: slideWidth || "100%" }}
            >
              <AnimatePresence mode="wait">
                {m.type === "image" ? (
                  <motion.img
                    key={m.src}
                    src={m.src}
                    alt={food.foodName}
                    onClick={() => setLightboxOpen(true)}
                    className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    draggable={false}
                  />
                ) : (
                  <motion.video
                    key={m.src}
                    src={m.src}
                    controls
                    playsInline
                    onClick={() => setLightboxOpen(true)}
                    className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  />
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>

      {/* DOTS — mobile */}
      {mediaList.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5 lg:hidden">
          {mediaList.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to media ${i + 1}`}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === activeIndex ? "bg-primary" : "bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>
      )}

      {/* THUMBNAILS — desktop */}
      {mediaList.length > 1 && (
        <div className="hidden lg:flex gap-3 mt-4 overflow-x-auto">
          {mediaList.map((m, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative w-14 h-14 rounded-md overflow-hidden border flex-shrink-0 ${
                i === activeIndex ? "border-primary" : "border-border"
              }`}
            >
              {m.type === "image" ? (
                <img
                  src={m.src}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <video src={m.src} className="w-full h-full object-cover" />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs">
                    ▶
                  </span>
                </>
              )}
            </button>
          ))}
        </div>
      )}

      {/* LIGHTBOX */}
      <FoodMediaLightbox
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        media={mediaList}
        index={activeIndex}
        setIndex={setActiveIndex}
      />
    </div>
  );
};
