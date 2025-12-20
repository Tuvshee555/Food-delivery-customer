/* eslint-disable @next/next/no-img-element */
"use client";

import { Trash2 } from "lucide-react";
import { CartItem } from "@/type/type";
import { classes } from "./styles";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

type Props = {
  item: CartItem;
  onUpdateQty: (change: number) => void;
  onRemove: () => void;
};

export const CartItemRow = ({ item, onUpdateQty, onRemove }: Props) => {
  const { t } = useI18n();

  return (
    <div className="flex gap-4 border-b border-border pb-6">
      {/* IMAGE */}
      <img
        src={item.food.image}
        alt={item.food.foodName}
        className={classes.img}
      />

      {/* CONTENT */}
      <div className="flex-1 flex flex-col gap-2">
        {/* NAME + REMOVE */}
        <div className="flex justify-between items-start gap-3">
          <div className="space-y-0.5">
            <p className="font-medium leading-snug">{item.food.foodName}</p>

            {/* SIZE (UNDER NAME) */}
            {item.selectedSize && (
              <p className="text-xs text-muted-foreground">
                {t("size")}: {item.selectedSize}
              </p>
            )}
          </div>

          <button
            onClick={onRemove}
            className="text-muted-foreground hover:text-destructive transition"
            aria-label={t("remove")}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* PRICE + QTY */}
        <div className="flex justify-between items-center mt-2">
          {/* PRICE */}
          <p className="font-semibold text-primary">
            {(item.food.price * item.quantity).toLocaleString()}₮
          </p>

          {/* QUANTITY CONTROLS */}
          <div className="flex items-center border border-border rounded-md overflow-hidden">
            <button
              onClick={() => onUpdateQty(-1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-muted transition"
            >
              −
            </button>

            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>

            <button
              onClick={() => onUpdateQty(1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-muted transition"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
