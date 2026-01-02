/* eslint-disable @next/next/no-img-element */
"use client";

import { Minus, Plus, X } from "lucide-react";

type CartItem = {
  foodId: string;
  quantity: number;
  selectedSize?: string | null;
  food: {
    id: string;
    foodName: string;
    price: number;
    image: string;
  };
};

type Props = {
  item: CartItem;
  onUpdateQty: (nextQty: number) => void;
  onRemove: () => void;
};

export const CartItemRow = ({ item, onUpdateQty, onRemove }: Props) => {
  const qty = Math.max(1, Number(item.quantity) || 1);
  const disableMinus = qty <= 1;

  return (
    <div className="flex justify-between items-center border px-3 border-border py-4 rounded-md">
      {/* LEFT */}
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={item.food.image}
          alt={item.food.foodName}
          className="w-[72px] h-[72px] rounded-lg object-cover shrink-0"
        />

        <div className="space-y-0.5 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {item.food.foodName}
          </p>
          <p className="text-sm text-foreground">
            ₮ {item.food.price.toLocaleString()}
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onUpdateQty(qty - 1)}
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
          {qty}
        </span>

        <button
          onClick={() => onUpdateQty(qty + 1)}
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
