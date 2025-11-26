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
  return (
    <div className="flex justify-between items-center border-b border-gray-800 pb-4">
      <div className="flex items-center gap-3">
        <img
          src={item.food.image}
          alt={item.food.foodName}
          className="w-[72px] h-[72px] rounded-xl"
        />
        <div>
          <p className="font-semibold">{item.food.foodName}</p>
          <p className="text-gray-400 text-sm">
            ₮ {item.food.price.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQty(item, -1)}
          className="px-3 py-1 bg-[#1c1c1c] rounded-full"
        >
          <Minus className="w-4 h-4" />
        </button>

        <span className="px-4 py-1 bg-[#facc15] text-black font-semibold rounded-full">
          {item.quantity}
        </span>

        <button
          onClick={() => onUpdateQty(item, 1)}
          className="px-3 py-1 bg-[#1c1c1c] rounded-full"
        >
          <Plus className="w-4 h-4" />
        </button>

        <button onClick={() => onRemove(item)}>
          <X className="w-5 h-5 text-red-500" />
        </button>
      </div>
    </div>
  );
};
