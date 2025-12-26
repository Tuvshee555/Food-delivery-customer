/* eslint-disable @next/next/no-img-element */
"use client";

import { CartItem } from "@/type/type";
import { Minus, Plus, X } from "lucide-react";

type Props = {
  item: CartItem;
  onUpdateQty: (item: CartItem, change: number) => void;
  onRemove: (item: CartItem) => void;
};

export const CartItemRow = ({ item, onUpdateQty, onRemove }: Props) => {
  const disableMinus = item.quantity <= 1;

  return (
    <div className="relative flex items-center gap-4 py-4 border-b border-border">
      {/* REMOVE */}
      <button
        onClick={() => onRemove(item)}
        className="
          absolute -top-2 -left-2
          h-6 w-6
          rounded-full
          bg-background
          border border-border
          flex items-center justify-center
        "
        aria-label="Remove item"
      >
        <X size={12} />
      </button>

      {/* IMAGE */}
      <img
        src={item.food.image}
        alt={item.food.foodName}
        className="w-16 h-16 rounded-md object-cover shrink-0"
      />

      {/* INFO */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.food.foodName}</p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col items-end gap-2">
        <p className="text-sm font-semibold">
          ₮ {item.food.price.toLocaleString()}
        </p>

        {/* QTY PILL */}
        {/* QTY PILL */}
        <div
          className="
    flex items-center
    rounded-md
    border border-border
    bg-card
  "
        >
          <button
            onClick={() => onUpdateQty(item, -1)}
            disabled={disableMinus}
            className="
      h-9 w-9
      flex items-center justify-center
      text-muted-foreground
      disabled:opacity-40
    "
          >
            <Minus size={14} />
          </button>

          <span
            className="
      h-9 min-w-[36px]
      flex items-center justify-center
      text-sm font-medium
      text-foreground
    "
          >
            {item.quantity}
          </span>

          <button
            onClick={() => onUpdateQty(item, 1)}
            className="
      h-9 w-9
      flex items-center justify-center
      text-muted-foreground
    "
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
