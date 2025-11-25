/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";

export default function PaymentSummary({
  cart,
  router,
  onSubmit,
}: {
  cart: any[];
  router: any;
  onSubmit: () => void;
}) {
  const total = cart.reduce((sum, i) => sum + i.food.price * i.quantity, 0);
  const delivery = 100;
  const grandTotal = total + delivery;

  return (
    <div className="w-full lg:w-[400px] bg-[#111]/90 border border-gray-800 rounded-3xl p-8 h-fit shadow-[0_0_40px_-10px_rgba(250,204,21,0.15)]">
      <h2 className="text-xl font-semibold mb-6 border-b border-gray-800 pb-3">
        Төлбөрийн мэдээлэл
      </h2>

      <div className="flex justify-between text-gray-300 mb-3">
        <span>Бүтээгдэхүүний дүн</span>
        <span>{total.toLocaleString()}₮</span>
      </div>
      <div className="flex justify-between text-gray-300 mb-3">
        <span>Хүргэлтийн дүн</span>
        <span>{delivery.toLocaleString()}₮</span>
      </div>
      <div className="border-t border-gray-700 my-4" />
      <div className="flex justify-between items-center font-semibold text-lg">
        <span>Нийт дүн</span>
        <span className="text-[#facc15] text-2xl">
          {grandTotal.toLocaleString()}₮
        </span>
      </div>

      <div className="flex mt-6 gap-2">
        <input
          type="text"
          placeholder="Купон код"
          className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#facc15] outline-none transition"
        />
        <button className="bg-[#facc15] text-black px-5 py-2 rounded-lg font-semibold hover:brightness-110 transition">
          Шалгах
        </button>
      </div>

      <div className="flex gap-3 mt-8">
        <Button
          variant="outline"
          onClick={() => router.push("/checkout")}
          className="border-gray-600 text-gray-300 hover:border-[#facc15] hover:text-[#facc15] w-full"
        >
          Буцах
        </Button>

        <Button
          onClick={onSubmit}
          className="w-full bg-gradient-to-r from-[#facc15] to-[#fbbf24] text-black font-semibold hover:brightness-110"
        >
          Захиалах
        </Button>
      </div>

      <p className="text-gray-500 text-sm mt-6 leading-snug flex gap-2 items-start">
        ⚠️ Хүргэлтийн бүсээс хамаарч хүргэлтийн төлбөрт өөрчлөлт орж болохыг
        анхаарна уу.
      </p>
    </div>
  );
}
