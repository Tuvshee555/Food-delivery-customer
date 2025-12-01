/* eslint-disable @next/next/no-img-element */
"use client";

import { Minus, Plus } from "lucide-react";
import React from "react";
import { CartItem } from "@/type/type";
import { classes } from "./styles";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

type Props = {
  item: CartItem;
  onUpdateQty: (change: number) => void;
  onRemove: () => void;
};

export const CartItemRow: React.FC<Props> = ({
  item,
  onUpdateQty,
  onRemove,
}) => {
  const { t } = useI18n();

  return (
    <div className={classes.itemRow}>
      <div className="flex items-center gap-5">
        <img
          src={item.food.image}
          alt={item.food.foodName}
          className={classes.img}
        />
        <div>
          <p className="font-semibold text-lg">{item.food.foodName}</p>

          {item.selectedSize && (
            <p className="text-gray-400 text-sm mt-1">
              {t("size")}: {item.selectedSize}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <p className="font-semibold text-[#facc15] text-lg">
          {(item.food.price * item.quantity).toLocaleString()}₮
        </p>

        <div className={classes.qtyControl}>
          <button
            onClick={() => onUpdateQty(-1)}
            className="px-3 py-1.5 hover:bg-[#2a2a2a]"
          >
            <Minus className="w-4 h-4 text-gray-300" />
          </button>

          <span className={classes.qtyBadge}>{item.quantity}</span>

          <button
            onClick={() => onUpdateQty(1)}
            className="px-3 py-1.5 hover:bg-[#2a2a2a]"
          >
            <Plus className="w-4 h-4 text-gray-300" />
          </button>
        </div>

        <button
          onClick={onRemove}
          className="text-red-400 text-xs hover:underline"
        >
          {t("delete")}
        </button>
      </div>
    </div>
  );
};
