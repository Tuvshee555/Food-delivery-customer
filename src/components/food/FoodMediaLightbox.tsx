/* components/food/FoodMediaLightbox.tsx */
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

export type Media = {
  type: "image" | "video";
  src: string;
};

export function FoodMediaLightbox({
  open,
  onClose,
  media,
  index,
  setIndex,
}: {
  open: boolean;
  onClose: () => void;
  media: Media[];
  index: number;
  setIndex: (i: number) => void;
}) {
  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight")
        setIndex(Math.min(media.length - 1, index + 1));
      if (e.key === "ArrowLeft") setIndex(Math.max(0, index - 1));
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, media.length, onClose, setIndex]);

  if (!open) return null;

  const current = media[index];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative max-w-full max-h-full"
          onClick={(e) => e.stopPropagation()}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -80 && index < media.length - 1)
              setIndex(index + 1);
            if (info.offset.x > 80 && index > 0) setIndex(index - 1);
          }}
        >
          {current.type === "image" ? (
            <motion.img
              src={current.src}
              className="max-h-screen max-w-screen object-contain cursor-zoom-in"
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            />
          ) : (
            <video
              src={current.src}
              controls
              autoPlay
              className="max-h-screen max-w-screen"
            />
          )}

          {/* CLOSE */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white text-2xl"
          >
            ✕
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
