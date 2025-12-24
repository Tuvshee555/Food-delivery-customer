/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { FoodType } from "@/type/type";

const getMediaUrl = (media?: string | File): string => {
  if (!media) return "/placeholder.png";
  return typeof media === "string" ? media : URL.createObjectURL(media);
};

export const FoodMedia = ({ food }: { food: FoodType }) => {
  const mediaList = useMemo(() => {
    const list: { type: "image" | "video"; src: string }[] = [];

    if (food.image) list.push({ type: "image", src: getMediaUrl(food.image) });

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
  useEffect(() => setActiveIndex(0), [mediaList.length]);

  // container width (slide width)
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [slideWidth, setSlideWidth] = useState(0);
  useEffect(() => {
    const update = () => {
      const w = containerRef.current?.offsetWidth ?? 0;
      setSlideWidth(w);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // detect touch devices (set on client)
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(
      typeof window !== "undefined" &&
        ("ontouchstart" in window || navigator.maxTouchPoints > 0)
    );
  }, []);

  // revoke blobs on unmount
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // drag end logic: use offset & velocity to decide new index
  const onDragEnd = (
    _: any,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    const dx = info.offset.x; // positive = dragged right
    const vx = info.velocity.x;
    if (slideWidth <= 0) return;

    let next = activeIndex - Math.round(dx / slideWidth);

    // velocity override: quick flick
    if (Math.abs(vx) > 600) {
      next = activeIndex - Math.sign(vx);
    }

    if (next < 0) next = 0;
    if (next > mediaList.length - 1) next = mediaList.length - 1;
    setActiveIndex(next);
  };

  return (
    <div className="w-full">
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
          style={{ x: 0, touchAction: "pan-y" }}
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
                    className="absolute inset-0 w-full h-full object-cover"
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
                    className="absolute inset-0 w-full h-full object-cover"
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

        {/* dots - mobile only */}
        {mediaList.length > 1 && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-3 lg:hidden flex gap-2 items-center">
            {mediaList.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Go to media ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-all duration-150 ${
                  i === activeIndex
                    ? "w-2.5 h-2.5 bg-primary"
                    : "bg-muted-foreground/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* thumbnails - desktop only */}
      {mediaList.length > 1 && (
        <div className="hidden lg:flex gap-3 mt-3 overflow-x-auto">
          {mediaList.map((m, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`
                relative
                w-14 h-14
                rounded-md
                overflow-hidden
                border
                flex-shrink-0
                ${i === activeIndex ? "border-primary" : "border-border"}
              `}
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
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-white text-xs bg-black/40">
                    ▶
                  </span>
                </>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
