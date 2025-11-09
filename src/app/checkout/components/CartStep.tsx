"use client";

import { Button } from "@/components/ui/button";

export default function CartStep({
  cart,
  router,
}: {
  cart: any[];
  router: any;
}) {
  const total = cart.reduce((sum, i) => sum + i.food.price * i.quantity, 0);
  const delivery = 9000;
  const grandTotal = total + delivery;

  return (
    <main className="min-h-screen bg-black text-white p-8 flex flex-col md:flex-row gap-10">
      <div className="flex-1 bg-[#111] p-6 rounded-2xl">
        <h1 className="text-2xl font-semibold mb-4">🛒 Таны сагс</h1>
        {cart.length ? (
          cart.map((item, i) => (
            <div
              key={i}
              className="flex justify-between border-b border-gray-800 py-3"
            >
              <div>
                <p className="font-semibold">{item.food.foodName}</p>
                <p className="text-gray-400 text-sm">x{item.quantity}</p>
              </div>
              <p>{(item.food.price * item.quantity).toLocaleString()}₮</p>
            </div>
          ))
        ) : (
          <p>Сагс хоосон байна.</p>
        )}
      </div>

      <div className="w-full md:w-[380px] bg-[#111] p-6 rounded-2xl h-fit">
        <div className="flex justify-between text-gray-300 mb-2">
          <span>Бүтээгдэхүүн</span> <span>{total.toLocaleString()}₮</span>
        </div>
        <div className="flex justify-between text-gray-300 mb-2">
          <span>Хүргэлт</span> <span>{delivery.toLocaleString()}₮</span>
        </div>
        <div className="flex justify-between font-semibold text-lg border-t border-gray-700 pt-2">
          <span>Нийт</span> <span>{grandTotal.toLocaleString()}₮</span>
        </div>

        <Button
          onClick={() => router.push("/checkout?step=info")}
          className="w-full mt-6 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold py-3 rounded-lg"
        >
          Үргэлжлүүлэх
        </Button>
      </div>
    </main>
  );
}
