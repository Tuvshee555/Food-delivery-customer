"use client";

import { motion } from "framer-motion";

export const FoodQuantity = ({
  quantity,
  setQuantity,
}: {
  quantity: number;
  setQuantity: (n: number) => void;
}) => {
  return (
    <div className="flex items-center gap-6 mt-2">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] border border-gray-700 text-xl hover:border-[#facc15] hover:text-[#facc15] transition"
      >
        −
      </motion.button>

      <span className="text-2xl font-semibold text-gray-100">{quantity}</span>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setQuantity(quantity + 1)}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] border border-gray-700 text-xl hover:border-[#facc15] hover:text-[#facc15] transition"
      >
        +
      </motion.button>
    </div>
  );
};
