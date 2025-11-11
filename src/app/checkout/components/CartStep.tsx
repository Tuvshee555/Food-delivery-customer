"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col md:flex-row gap-8 p-6 md:p-10">
      {/* LEFT: CART ITEMS */}
      <div className="flex-1 bg-[#0e0e0e]/90 border border-gray-800 rounded-3xl p-6 shadow-[0_0_30px_-10px_rgba(250,204,21,0.1)]">
        <h1 className="text-3xl font-bold mb-6 border-b border-gray-800 pb-3">
          🛒 Таны сагс
        </h1>

        {cart.length ? (
          <div className="space-y-5">
            {cart.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex justify-between items-center border-b border-gray-800 pb-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.food.image}
                    alt={item.food.foodName}
                    className="w-16 h-16 object-cover rounded-xl border border-gray-700"
                  />
                  <div>
                    <p className="font-semibold text-lg">
                      {item.food.foodName}
                    </p>
                    <p className="text-gray-400 text-sm">
                      x{item.quantity}
                      {item.selectedSize && (
                        <span className="ml-1 text-gray-500">
                          ({item.selectedSize})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-[#facc15] text-lg">
                  {(item.food.price * item.quantity).toLocaleString()}₮
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center mt-8">Сагс хоосон байна.</p>
        )}
      </div>

      {/* RIGHT: TOTAL SUMMARY */}
      <div className="w-full md:w-[400px] bg-[#0e0e0e]/90 border border-gray-800 rounded-3xl p-6 shadow-[0_0_40px_-10px_rgba(250,204,21,0.15)] h-fit">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-800 pb-3">
          Захиалгын дэлгэрэнгүй
        </h2>

        <div className="flex justify-between text-gray-300 mb-2">
          <span>Бүтээгдэхүүн</span>
          <span>{total.toLocaleString()}₮</span>
        </div>

        <div className="flex justify-between text-gray-300 mb-2">
          <span>Хүргэлт</span>
          <span>{delivery.toLocaleString()}₮</span>
        </div>

        <div className="flex justify-between items-center text-lg font-semibold border-t border-gray-700 pt-3 mt-3">
          <span>Нийт</span>
          <span className="text-[#facc15] text-2xl">
            {grandTotal.toLocaleString()}₮
          </span>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/checkout?step=info")}
          className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-[#facc15] to-[#fbbf24] text-black font-semibold text-lg shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:brightness-110 transition-all"
        >
          Үргэлжлүүлэх
        </motion.button>
      </div>
    </main>
  );
}
