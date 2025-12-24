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
    <div className="border-b border-border py-4">
      <div className="flex items-start gap-4">
        {/* IMAGE */}
        <img
          src={item.food.image}
          alt={item.food.foodName}
          className="w-14 h-14 rounded-lg object-cover shrink-0"
        />

        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          {/* NAME */}
          <p className="text-sm font-medium text-foreground leading-tight line-clamp-2">
            {item.food.foodName}
          </p>

          {/* PRICE */}
          <p className="mt-1 text-sm text-muted-foreground">
            ₮ {item.food.price.toLocaleString()}
          </p>

          {/* CONTROLS */}
          <div className="mt-3 flex items-center justify-between">
            {/* QTY */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateQty(item, -1)}
                disabled={disableMinus}
                className="
                  h-8 w-8
                  flex items-center justify-center
                  rounded-md
                  border border-border
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                "
              >
                <Minus size={14} />
              </button>

              <span className="min-w-[24px] text-center text-sm font-medium">
                {item.quantity}
              </span>

              <button
                onClick={() => onUpdateQty(item, 1)}
                className="
                  h-8 w-8
                  flex items-center justify-center
                  rounded-md
                  border border-border
                "
              >
                <Plus size={14} />
              </button>
            </div>

            {/* REMOVE */}
            <button
              onClick={() => onRemove(item)}
              className="p-2 text-destructive"
              aria-label="Remove item"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
