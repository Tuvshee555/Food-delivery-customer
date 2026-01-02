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
    <>
      {/* CARD */}
      <div
        className="
          bg-card rounded-xl space-y-4
          border border-border p-4
          sm:p-6
        "
      >
        <h2 className="text-base font-semibold sm:border-b sm:border-border sm:pb-3">
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

        <div className="pt-4 flex justify-between items-center sm:border-t sm:border-border">
          <span className="text-base font-semibold">{t("grand_total")}</span>
          <span className="text-xl font-semibold">
            {grandTotal.toLocaleString()}₮
          </span>
        </div>

        {/* DESKTOP BUTTON */}
        <button
          onClick={onCheckout}
          className="
    hidden sm:flex
    w-full h-[44px]
    items-center justify-center
    rounded-md
    bg-primary text-primary-foreground
    text-sm font-medium
  "
        >
          {t("continue")}
        </button>

        {onClear && (
          <button
            onClick={onClear}
            className="
              hidden sm:block
              w-full h-[44px]
              text-sm text-destructive
            "
          >
            {t("clear_cart")}
          </button>
        )}
      </div>

      {/* ✅ MOBILE STICKY ACTION */}
      <div
        className="
          sm:hidden
          fixed bottom-0 left-0 right-0
          bg-background border-t border-border
          p-4
        "
      >
        <button
          onClick={onCheckout}
          className="
            w-full h-[44px]
            rounded-md
            bg-primary text-primary-foreground
            text-sm font-medium
          "
        >
          {t("continue")}
        </button>
      </div>
    </>
  );
};
