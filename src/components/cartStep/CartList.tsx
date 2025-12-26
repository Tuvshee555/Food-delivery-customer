"use client";

import React from "react";
import { CartItem } from "@/type/type";
import { CartItemRow } from "./CartItemRow";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

type Props = {
  items: CartItem[];
  onUpdateQty: (item: CartItem, change: number) => void | Promise<void>;
  onRemove: (item: CartItem) => void | Promise<void>;
};

export const CartList: React.FC<Props> = ({ items, onUpdateQty, onRemove }) => {
  const { t } = useI18n();

  if (!items.length) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        {t("cart.empty")}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <CartItemRow
          key={item.id ?? `${item.foodId}-${item.selectedSize ?? "def"}`}
          item={item}
          onUpdateQty={(change) => onUpdateQty(item, change)}
          onRemove={() => onRemove(item)}
        />
      ))}
    </div>
  );
};
