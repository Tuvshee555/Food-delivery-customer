"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import Link from "next/link";

const slides = [
  { src: "/BackMain.jpg", subtitleKey: "featured_collection", titleKey: "featured" },
  { src: "/BackMain.jpg", subtitleKey: "featured_collection", titleKey: "new" },
  { src: "/BackMain.jpg", subtitleKey: "featured_collection", titleKey: "bestseller" },
];

export function HeroCarousel() {
  const { t, locale } = useI18n();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setActive((p) => (p + 1) % slides.length), []);
  const prev = useCallback(() => setActive((p) => (p - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <div
      className="relative w-full h-[70vh] min-h-[500px] max-h-[700px] overflow-hidden bg-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src={slides[active].src}
            alt="Hero slide"
            fill
            priority={active === 0}
            sizes="100vw"
            className="object-cover"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

          {/* Text overlay */}
          <motion.div
            className="absolute left-8 md:left-16 bottom-20 max-w-xs md:max-w-md"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-white/70 text-xs md:text-sm uppercase tracking-widest mb-2 font-medium">
              {t(slides[active].subtitleKey)}
            </p>
            <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-5">
              {t(slides[active].titleKey)}
            </h2>
            <Link
              href={`/${locale}/category/all`}
              className="inline-flex items-center px-6 py-2.5 rounded-lg border border-white/70 text-white text-sm font-medium
                hover:bg-white hover:text-black transition-all duration-200"
            >
              {t("shop_now")}
            </Link>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full
          bg-background/20 backdrop-blur-sm border border-white/20 hover:bg-background/40
          flex items-center justify-center transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full
          bg-background/20 backdrop-blur-sm border border-white/20 hover:bg-background/40
          flex items-center justify-center transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all duration-300
              ${i === active ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
