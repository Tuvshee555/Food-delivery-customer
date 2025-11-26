"use client";

import { motion } from "framer-motion";

export const FoodActions = ({
  onAddToCart,
  onOrderNow,
  isProcessing,
}: {
  onAddToCart: () => void;
  onOrderNow: () => void;
  isProcessing: boolean;
}) => {
  return (
    <div className="flex gap-4 mt-6">
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onAddToCart}
        disabled={isProcessing}
        className="flex-1 py-4 rounded-2xl bg-[#111] border border-gray-700 text-white font-semibold text-lg hover:border-[#facc15] transition-all disabled:opacity-60"
      >
        🛒 Сагсанд нэмэх
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onOrderNow}
        disabled={isProcessing}
        className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#facc15] to-[#fbbf24] text-black font-semibold text-lg shadow-[0_0_25px_rgba(250,204,21,0.4)] hover:brightness-110 transition-all disabled:opacity-60"
      >
        Захиалах
      </motion.button>
    </div>
  );
};
