// components/cartStep/CartSummary.tsx
"use client";

import React from "react";

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
  const grandTotal = total + delivery;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-4">
        Төлбөрийн мэдээлэл
      </h2>

      <div className="flex justify-between text-gray-300 mb-3">
        <span>Бүтээгдэхүүн</span>
        <span>{total.toLocaleString()}₮</span>
      </div>

      <div className="flex justify-between text-gray-300 mb-3">
        <span>Хүргэлт</span>
        <span>{delivery.toLocaleString()}₮</span>
      </div>

      <div className="border-t border-gray-700 my-4" />

      <div className="flex justify-between items-center text-xl font-semibold">
        <span>Нийт дүн</span>
        <span className="text-[#facc15] text-3xl">
          {grandTotal.toLocaleString()}₮
        </span>
      </div>

      <button
        onClick={onCheckout}
        className="w-full mt-8 py-4 rounded-xl bg-gradient-to-r from-[#facc15] to-[#fbbf24] text-black font-semibold text-lg shadow-lg"
      >
        Үргэлжлүүлэх
      </button>

      {onClear && (
        <button
          onClick={onClear}
          className="w-full mt-3 text-sm text-gray-400 hover:text-red-500"
        >
          🗑 Сагс хоослох
        </button>
      )}
    </div>
  );
};
