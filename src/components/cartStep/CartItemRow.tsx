/* eslint-disable @next/next/no-img-element */
"use client";

import { CartItem } from "@/type/type";
import { Minus, Plus, X } from "lucide-react";

type Props = {
  item: CartItem;
  onUpdateQty: (change: number) => void;
  onRemove: () => void;
};

export const CartItemRow = ({ item, onUpdateQty, onRemove }: Props) => {
  const disableMinus = item.quantity <= 1;

  return (
    <div className="flex justify-between items-center border-b border-border py-4">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <img
          src={item.food.image}
          alt={item.food.foodName}
          className="w-[72px] h-[72px] rounded-lg object-cover"
        />

        <div className="space-y-0.5">
          <p className="text-sm font-medium text-foreground">
            {item.food.foodName}
          </p>
          <p className="text-sm text-foreground">
            ₮ {item.food.price.toLocaleString()}
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQty(-1)}
          disabled={disableMinus}
          className="
            h-[36px] w-[36px]
            flex items-center justify-center
            rounded-md
            border border-border
            text-foreground
            disabled:opacity-40
            disabled:cursor-not-allowed
          "
        >
          <Minus size={16} />
        </button>

        <span className="min-w-[28px] text-center text-sm font-medium">
          {item.quantity}
        </span>

        <button
          onClick={() => onUpdateQty(1)}
          className="
            h-[36px] w-[36px]
            flex items-center justify-center
            rounded-md
            border border-border
            text-foreground
          "
        >
          <Plus size={16} />
        </button>

        <button
          onClick={onRemove}
          className="
            h-[36px] w-[36px]
            flex items-center justify-center
            rounded-md
            text-destructive
          "
          aria-label="Remove item"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
