"use client";

import { motion } from "framer-motion";

type FoodActionsProps = {
  onAddToCart: () => void;
  onOrderNow: () => void;
  isProcessing: boolean;
  addText: string;
  orderText: string;
  primaryClass?: string;
  secondaryClass?: string;
};

export const FoodActions = ({
  onAddToCart,
  onOrderNow,
  isProcessing,
  addText,
  orderText,
  primaryClass = "",
  secondaryClass = "",
}: FoodActionsProps) => {
  return (
    <div className="flex gap-3 mt-4">
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onAddToCart}
        disabled={isProcessing}
        className={`
          flex-1
          ${secondaryClass}
          disabled:opacity-60
        `}
      >
        {addText}
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onOrderNow}
        disabled={isProcessing}
        className={`
          flex-1
          ${primaryClass}
          disabled:opacity-60
        `}
      >
        {orderText}
      </motion.button>
    </div>
  );
};
