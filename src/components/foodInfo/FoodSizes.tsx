/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

export const FoodSizes = ({
  sizes,
  selectedSize,
  setSelectedSize,
}: {
  sizes: any[];
  selectedSize: string | null;
  setSelectedSize: (s: string) => void;
}) => {
  const { t } = useI18n();

  // 🔒 Hooks MUST be before any return
  useEffect(() => {
    if (!sizes || sizes.length === 0) return;

    if (!selectedSize) {
      const first = typeof sizes[0] === "string" ? sizes[0] : sizes[0]?.label;

      if (first) setSelectedSize(first);
    }
  }, [sizes, selectedSize, setSelectedSize]);

  // ⛔ Safe early return AFTER hooks
  if (!sizes || sizes.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {t("size")}
      </h3>

      <div className="flex flex-wrap gap-2">
        {sizes.map((s, i) => {
          const label =
            typeof s === "string"
              ? s
              : typeof s === "object" && "label" in s
              ? s.label
              : "";

          const active = selectedSize === label;

          return (
            <motion.button
              key={i}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelectedSize(label)}
              className={`
                h-[36px]
                px-4
                rounded-md
                text-sm
                font-medium
                transition-colors
                border
                ${
                  active
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-foreground border-border hover:bg-muted"
                }
              `}
              aria-pressed={active}
            >
              {label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
