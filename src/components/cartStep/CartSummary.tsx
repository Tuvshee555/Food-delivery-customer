// components/cartStep/CartSummary.tsx
"use client";

import React from "react";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

type Props = {
  total: number;
  delivery: number;
  onCheckout: () => void;
  onClear?: () => void;
};

export const CartSummary: React.FC<Props> = ({
  total,
  delivery,
  onCheckout,
  onClear,
}) => {
  const { t } = useI18n();
  const grandTotal = total + delivery;

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <h2 className="text-base font-semibold border-b border-border pb-3">
        {t("payment_info")}
      </h2>

      <div className="flex justify-between text-sm">
        <span>{t("product_total")}</span>
        <span>{total.toLocaleString()}₮</span>
      </div>

      <div className="flex justify-between text-sm">
        <span>{t("delivery_fee")}</span>
        <span>{delivery.toLocaleString()}₮</span>
      </div>

      <div className="border-t border-border pt-4 flex justify-between items-center">
        <span className="text-base font-semibold">
          {t("grand_total")}
        </span>
        <span className="text-xl font-semibold">
          {grandTotal.toLocaleString()}₮
        </span>
      </div>

      <button
        onClick={onCheckout}
        className="w-full h-[44px] rounded-md bg-primary text-primary-foreground text-sm font-medium"
      >
        {t("continue")}
      </button>

      {onClear && (
        <button
          onClick={onClear}
          className="w-full h-[44px] text-sm text-destructive"
        >
          {t("clear_cart")}
        </button>
      )}
    </div>
  );
};
