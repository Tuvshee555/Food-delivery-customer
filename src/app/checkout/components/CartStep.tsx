/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/header/Header";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartStep({
  cart,
  router,
}: {
  cart: any[];
  router: any;
}) {
  const [items, setItems] = useState<any[]>(cart || []);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setItems(JSON.parse(stored));
  }, [cart]);

  const total = items.reduce((sum, i) => sum + i.food.price * i.quantity, 0);
  const delivery = 100;
  const grandTotal = total + delivery;

  // Quantity controls
  const increaseQuantity = (index: number) => {
    const updated = [...items];
    updated[index].quantity++;
    setItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const decreaseQuantity = (index: number) => {
    const updated = [...items];
    if (updated[index].quantity > 1) {
      updated[index].quantity--;
      setItems(updated);
      localStorage.setItem("cart", JSON.stringify(updated));
    }
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("cart");
  };

  return (
    <>
      <Header compact />

      <main className="min-h-screen bg-[#0a0a0a] text-white pt-[130px] pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col lg:flex-row gap-10">
          {/* 🧾 LEFT: CART ITEMS */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 bg-[#111111]/90 border border-gray-800 rounded-3xl p-8 shadow-[0_0_40px_-10px_rgba(250,204,21,0.15)]"
          >
            <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
              <h1 className="text-3xl font-bold tracking-tight">
                🛒 Таны сагс
              </h1>
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Хоослох
                </button>
              )}
            </div>

            {items.length ? (
              <div className="space-y-6">
                {items.map((item, i) => (
                  <motion.div
                    key={item.food._id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex justify-between items-center border-b border-gray-800 pb-6"
                  >
                    {/* LEFT: Image + Info */}
                    <div className="flex items-center gap-5">
                      <img
                        src={item.food.image}
                        alt={item.food.foodName}
                        className="w-24 h-24 object-cover rounded-2xl border border-gray-700"
                      />
                      <div>
                        <p className="font-semibold text-lg">
                          {item.food.foodName}
                        </p>
                        {item.selectedSize && (
                          <p className="text-gray-400 text-sm mt-1">
                            Хэмжээ: {item.selectedSize}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* RIGHT: Price + Controls */}
                    <div className="flex flex-col items-end gap-2">
                      <p className="font-semibold text-[#facc15] text-lg">
                        {(item.food.price * item.quantity).toLocaleString()}₮
                      </p>
                      <div className="flex items-center rounded-full bg-[#1c1c1c] border border-gray-700 overflow-hidden">
                        <button
                          onClick={() => decreaseQuantity(i)}
                          className="px-3 py-1.5 text-gray-300 hover:bg-[#2a2a2a] transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-1 bg-[#facc15] text-black font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(i)}
                          className="px-3 py-1.5 text-gray-300 hover:bg-[#2a2a2a] transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center mt-20 text-lg">
                🛍 Сагс хоосон байна.
              </p>
            )}
          </motion.section>

          {/* 💰 RIGHT: SUMMARY */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full lg:w-[420px] bg-[#111111]/90 border border-gray-800 rounded-3xl p-8 shadow-[0_0_40px_-10px_rgba(250,204,21,0.15)] h-fit"
          >
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

            {/* Coupon input */}
            <div className="flex mt-8 gap-2">
              <input
                type="text"
                placeholder="Купон код"
                className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#facc15] outline-none transition"
              />
              <button className="bg-[#facc15] text-black px-5 py-2 rounded-lg font-semibold hover:brightness-110 transition">
                Шалгах
              </button>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/checkout?step=info")}
              className="w-full mt-8 py-4 rounded-xl bg-gradient-to-r from-[#facc15] to-[#fbbf24] text-black font-semibold text-lg shadow-[0_0_25px_rgba(250,204,21,0.3)] hover:brightness-110 transition-all"
            >
              Үргэлжлүүлэх
            </motion.button>

            <p className="text-gray-500 text-sm mt-6 leading-snug flex gap-2 items-start">
              ⚠️ Хүргэлтийн бүсээс хамаарч хүргэлтийн төлбөрт өөрчлөлт орж
              болохыг анхаарна уу.
            </p>
          </motion.section>
        </div>
      </main>
    </>
  );
}
