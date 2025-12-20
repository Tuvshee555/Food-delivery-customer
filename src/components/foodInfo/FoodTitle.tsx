"use client";

import { useI18n } from "@/components/i18n/ClientI18nProvider";

export const FoodTitle = ({
  name,
  price,
  oldPrice,
}: {
  name: string;
  price: number;
  oldPrice?: number;
}) => {
  const { t } = useI18n();

  const hasDiscount =
    typeof oldPrice === "number" && !Number.isNaN(oldPrice) && oldPrice > price;

  const savings = hasDiscount ? oldPrice - price : 0;
  const discountPercent = hasDiscount
    ? Math.round((savings / oldPrice!) * 100)
    : 0;

  const fmt = (v: number) =>
    v.toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <div className="pb-4 border-b border-border space-y-2">
      {/* TITLE — main focus */}
      <h1
        className="
          text-xl sm:text-2xl md:text-3xl
          font-semibold
          tracking-tight
          text-foreground
          leading-snug
        "
      >
        {name}
      </h1>

      {/* PRICE ROW */}
      <div className="flex items-center gap-3">
        {/* FINAL PRICE */}
        <span
          className="
            text-lg sm:text-xl
            font-medium
            text-foreground
          "
        >
          {fmt(price)}₮
        </span>

        {/* OLD PRICE */}
        {hasDiscount && (
          <span
            className="
              text-sm
              text-muted-foreground
              line-through
            "
          >
            {fmt(oldPrice!)}₮
          </span>
        )}
      </div>

      {/* DISCOUNT INFO — subtle, classic */}
      {hasDiscount && (
        <div className="text-sm text-muted-foreground">
          {t("save")} {fmt(savings)}₮
          <span className="ml-1">({discountPercent}%)</span>
        </div>
      )}
    </div>
  );
};
