"use client";

import { motion } from "framer-motion";

export interface FoodActionsProps {
  onAddToCart: () => void | Promise<void>;
  onOrderNow: () => void | Promise<void>;
  isProcessing: boolean;
  addText: string;
  orderText: string;
  primaryClass?: string;
  secondaryClass?: string;
}

export const FoodActions = ({
  onAddToCart,
  onOrderNow,
  isProcessing,
  addText,
  orderText,
}: FoodActionsProps) => {
  return (
    <div className="flex flex-col gap-3 mt-4">
      {/* PRIMARY ACTION */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onOrderNow}
        disabled={isProcessing}
        className="
          h-[48px]
          w-full
          rounded-md
          bg-foreground
          text-background
          text-sm font-medium
          disabled:opacity-60
          transition
        "
      >
        {orderText}
      </motion.button>

      {/* SECONDARY ACTION */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onAddToCart}
        disabled={isProcessing}
        className="
          h-[48px]
          w-full
          rounded-md
          bg-muted
          text-foreground
          text-sm font-medium
          disabled:opacity-60
          transition
        "
      >
        {addText}
      </motion.button>
    </div>
  );
};
