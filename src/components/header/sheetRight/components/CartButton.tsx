"use client";

import React, { forwardRef } from "react";
import { ShoppingCart } from "lucide-react";
import { motion, MotionProps } from "framer-motion";

type Props = {
  count: number;
} & MotionProps;

export const CartButton = forwardRef<HTMLButtonElement, Props>(
  ({ count, ...motionProps }, ref) => {
    return (
      <motion.button
        // pass the ref to the real button element (required by Radix asChild)
        ref={ref}
        {...motionProps}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center justify-center w-[42px] h-[42px]
                 rounded-full border border-gray-700 bg-[#1a1a1a]
                 hover:border-[#facc15] transition-all duration-300
                 hover:shadow-[0_0_12px_rgba(250,204,21,0.3)] group"
      >
        <ShoppingCart
          className="w-[20px] h-[20px] text-gray-300 group-hover:text-[#facc15]"
          strokeWidth={1.8}
        />

        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="absolute -top-[6px] -right-[6px] bg-[#facc15] text-black
                     text-[11px] font-bold rounded-full w-[18px] h-[18px]
                     flex items-center justify-center shadow-[0_0_10px_rgba(250,204,21,0.5)]"
          >
            {count}
          </motion.span>
        )}
      </motion.button>
    );
  }
);

CartButton.displayName = "CartButton";
