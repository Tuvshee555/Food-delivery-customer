"use client";

import React from "react";
import { CartItem } from "@/type/type";
import { CartItemRow } from "./CartItemRow";

type Props = {
  items: CartItem[];
  onUpdateQty: (index: number, change: number) => void;
  onRemove: (index: number) => void;
};

export const CartList: React.FC<Props> = ({ items, onUpdateQty, onRemove }) => {
  if (!items.length) {
    return (
      <p className="text-muted-foreground text-center py-16 text-sm">
        🛍 Сагс хоосон байна.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {items.map((item, i) => (
        <CartItemRow
          key={item.id ?? `${item.foodId}-${item.selectedSize ?? "def"}`}
          item={item}
          onUpdateQty={(change) => onUpdateQty(i, change)}
          onRemove={() => onRemove(i)}
        />
      ))}
    </div>
  );
};
