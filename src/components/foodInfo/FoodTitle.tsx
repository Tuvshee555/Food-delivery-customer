"use client";

export const FoodTitle = ({
  name,
  totalPrice,
}: {
  name: string;
  totalPrice: number;
}) => {
  return (
    <div className="border-b border-gray-800 pb-4">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
        {name}
      </h1>
      <p className="text-3xl font-semibold text-[#facc15]">
        {totalPrice.toLocaleString()}₮
      </p>
    </div>
  );
};
