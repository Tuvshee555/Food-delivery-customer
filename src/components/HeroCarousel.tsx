"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import Link from "next/link";
import MagneticButton from "@/components/motion/MagneticButton";

const slides = [
  { src: "/BackMain.jpg", subtitleKey: "featured_collection", titleKey: "featured" },
  { src: "/BackMain.jpg", subtitleKey: "featured_collection", titleKey: "new" },
  { src: "/BackMain.jpg", subtitleKey: "featured_collection", titleKey: "bestseller" },
];

// Split text into characters, each animated individually
function CharReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  const chars = text.split("");
  return (
    <span className="inline-flex flex-wrap overflow-hidden">
      {chars.map((char, i) => (
        <span key={i} className="overflow-hidden inline-block">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: delay + i * 0.03,
              ease: [0.25, 0.46, 0.45, 0.94] as any,
            }}
          >
            {char === " " ? "\u00a0" : char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

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
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as any }}
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />

          {/* Text overlay */}
          <div className="absolute left-8 md:left-16 bottom-20 max-w-xs md:max-w-lg">
            <motion.p
              className="text-white/60 text-xs md:text-sm uppercase tracking-[0.2em] mb-3 font-medium"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {t(slides[active].subtitleKey)}
            </motion.p>

            <h2 className="text-white text-4xl md:text-5xl font-black leading-tight mb-6 tracking-tight">
              <CharReveal text={t(slides[active].titleKey)} delay={0.15} />
            </h2>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              <MagneticButton strength={0.3}>
                <Link
                  href={`/${locale}/category/all`}
                  className="inline-flex items-center px-8 py-3 rounded-full border border-white/70 text-white text-sm font-semibold
                    hover:bg-white hover:text-black transition-all duration-300 tracking-wide"
                >
                  {t("shop_now")}
                </Link>
              </MagneticButton>
            </motion.div>
          </div>
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
