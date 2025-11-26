/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";

export const FoodSizes = ({
  sizes,
  selectedSize,
  setSelectedSize,
}: {
  sizes: any[];
  selectedSize: string | null;
  setSelectedSize: (s: string | null) => void;
}) => {
  if (!sizes || sizes.length === 0) return null;

  return (
    <div>
      <h3 className="text-gray-400 mb-3 text-sm uppercase">Хэмжээ:</h3>

      <div className="flex flex-wrap gap-3">
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={i}
              onClick={() => setSelectedSize(label)}
              className={`px-5 py-2 rounded-full font-medium text-sm transition-all ${
                active
                  ? "bg-[#facc15] text-black shadow-[0_0_15px_rgba(250,204,21,0.3)]"
                  : "bg-[#1a1a1a] text-gray-300 border border-gray-700 hover:border-[#facc15]"
              }`}
            >
              {label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
