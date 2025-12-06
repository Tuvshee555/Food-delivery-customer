"use client";

export const FoodTitle = ({
  name,
  price,
  oldPrice,
}: {
  name: string;
  price: number;
  oldPrice?: number;
}) => {
  const hasDiscount =
    typeof oldPrice === "number" && !Number.isNaN(oldPrice) && oldPrice > price;

  const savings = hasDiscount ? oldPrice - price : 0;
  const discountPercent = hasDiscount
    ? Math.round((savings / oldPrice) * 100)
    : 0;

  const fmt = (v: number) =>
    v.toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <div className="border-b border-gray-800 pb-4">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
        {name}
      </h1>

      {hasDiscount && (
        <p className="text-sm font-medium text-red-400 mb-1 animate-pulse">
          {`Хэмнэлт: ${fmt(savings)}₮ `}
          <span className="text-red-500">(-{discountPercent}%)</span>
        </p>
      )}

      <div className="flex items-center gap-3">
        {/* Final price */}
        <p className="text-3xl font-bold text-[#facc15]">{fmt(price)}₮</p>

        {/* Old Price */}
        {hasDiscount && (
          <p className="text-lg text-gray-500 line-through select-none">
            {fmt(oldPrice!)}₮
          </p>
        )}
      </div>
    </div>
  );
};
