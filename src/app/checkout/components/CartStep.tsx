/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/app/provider/AuthProvider";
import { useRouter } from "next/navigation";

export default function CartStep({}: {}) {
  const { userId, token, loading: authLoading } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const router = useRouter();

  const syncLocalCart = async () => {
    if (token && !userId) return;
    if (!token) return;

    const localCartRaw = localStorage.getItem("cart");
    if (!localCartRaw) return;

    const local = JSON.parse(localCartRaw);
    if (!local.length) return;

    // backup in case sync fails
    localStorage.setItem("cart-backup", localCartRaw);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/sync`,
        { userId, items: local },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status !== 200) throw new Error("Sync failed");

      // remove ONLY if successful
      localStorage.removeItem("cart");
      localStorage.removeItem("cart-backup");
      localStorage.setItem("cart-updated", Date.now().toString());

      window.dispatchEvent(
        new StorageEvent("storage", { key: "cart-updated" })
      );
    } catch (err) {
      console.log("Sync failed:", err);

      // restore backup
      const backup = localStorage.getItem("cart-backup");
      if (backup) localStorage.setItem("cart", backup);

      toast.error("Сагс синк хийхэд алдаа гарлаа.");
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (token && !userId) return; // wait for userId
    if (!token) return;

    const load = async () => {
      await new Promise((r) => setTimeout(r, 120)); // allow AuthProvider to stabilize
      await syncLocalCart();

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setItems(res.data.items || []);
      } catch (err) {
        toast.error("Сагс ачаалахад алдаа гарлаа.");
      }
    };

    load();
  }, [authLoading, userId, token]);

  if (authLoading) {
    return <p className="text-white p-10">Түр хүлээнэ үү...</p>;
  }

  const total = items.reduce(
    (sum, i) => sum + (i.food?.price || 0) * i.quantity,
    0
  );
  const delivery = 100;
  const grandTotal = total + delivery;

  // ⭐ Increase
  const increaseQuantity = async (index: number) => {
    const item = items[index];

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/update`, {
        id: item.id,
        quantity: item.quantity + 1,
      });

      const updated = [...items];
      updated[index].quantity++;
      setItems(updated);

      // 🔥 notify header
      localStorage.setItem("cart-updated", Date.now().toString());
      window.dispatchEvent(
        new StorageEvent("storage", { key: "cart-updated" })
      );
    } catch {
      toast.error("Тоо ширхэг нэмэхэд алдаа гарлаа.");
    }
  };

  // ⭐ Decrease
  const decreaseQuantity = async (index: number) => {
    const item = items[index];
    if (item.quantity <= 1) return;

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/update`, {
        id: item.id,
        quantity: item.quantity - 1,
      });

      const updated = [...items];
      updated[index].quantity--;
      setItems(updated);

      // 🔥 notify
      localStorage.setItem("cart-updated", Date.now().toString());
      window.dispatchEvent(
        new StorageEvent("storage", { key: "cart-updated" })
      );
    } catch {
      toast.error("Тоо ширхэг хасахад алдаа гарлаа.");
    }
  };

  // ⭐ Remove item
  const removeItem = async (index: number) => {
    const item = items[index];

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/remove`, {
        id: item.id,
      });

      setItems(items.filter((_, i) => i !== index));
      toast.success("Бараа устгагдлаа.");

      // 🔥 notify
      localStorage.setItem("cart-updated", Date.now().toString());
      window.dispatchEvent(
        new StorageEvent("storage", { key: "cart-updated" })
      );
    } catch {
      toast.error("Устгахад алдаа гарлаа.");
    }
  };

  // ⭐ Clear all
  const clearCart = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/clear`, {
        userId,
      });

      setItems([]);
      toast.success("Сагс хоослогдлоо.");

      // 🔥 notify
      localStorage.setItem("cart-updated", Date.now().toString());
      window.dispatchEvent(
        new StorageEvent("storage", { key: "cart-updated" })
      );
    } catch {
      toast.error("Сагс хоослох үед алдаа гарлаа.");
    }
  };

  return (
    <>
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
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex justify-between items-center border-b border-gray-800 pb-6"
                  >
                    {/* LEFT: Image + Info */}
                    <div className="flex items-center gap-5">
                      <img
                        src={item.food?.image}
                        alt={item.food?.foodName}
                        className="w-24 h-24 object-cover rounded-2xl border border-gray-700"
                      />
                      <div>
                        <p className="font-semibold text-lg">
                          {item.food?.foodName}
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
                        {(item.food?.price * item.quantity).toLocaleString()}₮
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

                      <button
                        onClick={() => removeItem(i)}
                        className="text-red-400 text-xs hover:underline"
                      >
                        Устгах
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center mt-20 text-lg">
                🛍 Сагс хоосон байна22.
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
              Төлбөрийн мэдээлэл1
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

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (!token) {
                  return;
                }
                router.push("/checkout?step=info");
              }}
              className="w-full mt-8 py-4 rounded-xl bg-gradient-to-r from-[#facc15] to-[#fbbf24] text-black font-semibold text-lg shadow-[0_0_25px_rgba(250,204,21,0.3)] hover:brightness-110 transition-all"
            >
              Үргэлжлүүлэх
            </motion.button>
          </motion.section>
        </div>
      </main>
    </>
  );
}
