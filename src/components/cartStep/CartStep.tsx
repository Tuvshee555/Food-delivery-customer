/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/app/provider/AuthProvider";
import { CartItem } from "@/type/type";
import {
  syncLocalCartHelper,
  loadServerCartHelper,
  updateQtyHelper,
  removeItemHelper,
  clearCartHelper,
  loadLocalCartHelper,
  updateLocalQtyHelper,
  removeLocalHelper,
  clearLocalHelper,
} from "./helpers";

export default function CartStep() {
  const { userId, token, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);

  const loadLocalCart = useCallback(() => {
    const local = loadLocalCartHelper();
    setItems(local);
  }, []);

  const loadServerCart = useCallback(async () => {
    if (!token || !userId) return;
    const data = await loadServerCartHelper(token, userId);
    setItems(data);
  }, [token, userId]);

  const syncLocalCart = useCallback(async () => {
    if (token && userId) {
      await syncLocalCartHelper(token, userId);
    }
  }, [token, userId]);

  useEffect(() => {
    if (loading) return;
    if (!token || !userId) {
      loadLocalCart();
      return;
    }

    const run = async () => {
      await syncLocalCart();
      await loadServerCart();
    };

    run();
  }, [loading, token, userId, syncLocalCart, loadServerCart, loadLocalCart]);

  useEffect(() => {
    const handler = () => {
      if (!token || !userId) loadLocalCart();
      else loadServerCart();
    };

    window.addEventListener("cart-updated", handler);

    const storageHandler = (e: StorageEvent) => {
      if (e.key === "cart" || e.key === "cart-updated") {
        handler();
      }
    };
    window.addEventListener("storage", storageHandler);

    return () => {
      window.removeEventListener("cart-updated", handler);
      window.removeEventListener("storage", storageHandler);
    };
  }, [token, userId, loadLocalCart, loadServerCart]);

  if (loading) {
    return <p className="text-white p-10">Түр хүлээнэ үү...</p>;
  }

  const total = items.reduce((sum, i) => sum + i.food.price * i.quantity, 0);
  const delivery = 100;
  const grandTotal = total + delivery;

  const emitCartUpdated = () => {
    try {
      localStorage.setItem("cart-updated", Date.now().toString());
    } catch {}
    window.dispatchEvent(new Event("cart-updated"));
  };

  // NOTE: handle local vs server update correctly and guard missing id
  const updateQuantity = async (index: number, change: number) => {
    const target = items[index];
    const newQty = target.quantity + change;
    if (newQty < 1) return;

    // optimistic update
    const updated = [...items];
    updated[index] = { ...updated[index], quantity: newQty };
    setItems(updated);

    if (!userId || !token) {
      updateLocalQtyHelper(target, newQty);
      emitCartUpdated();
      return;
    }

    // server path — require id
    if (!target.id) {
      toast.error("Item id missing — could not update on server.");
      // revert optimistic update by reloading server state
      await loadServerCart();
      return;
    }

    const ok = await updateQtyHelper(target.id, newQty);
    if (!ok) {
      // revert to server state if server call failed
      await loadServerCart();
      return;
    }

    emitCartUpdated();
  };

  const removeItem = async (index: number) => {
    const target = items[index];

    // optimistic UI
    setItems((prev) => prev.filter((_, i) => i !== index));

    if (!userId || !token) {
      removeLocalHelper(target);
      toast.success("Бараа устгагдлаа.");
      emitCartUpdated();
      return;
    }

    if (!target.id) {
      toast.error("Item id missing — could not remove from server.");
      await loadServerCart();
      return;
    }

    const ok = await removeItemHelper(target.id);
    if (!ok) {
      await loadServerCart();
      return;
    }

    toast.success("Бараа устгагдлаа.");
    emitCartUpdated();
  };

  const clearCart = async () => {
    // optimistic UI
    setItems([]);

    if (!userId || !token) {
      clearLocalHelper();
      toast.success("Сагс хоослогдлоо.");
      emitCartUpdated();
      return;
    }

    const ok = await clearCartHelper(userId);
    if (!ok) {
      await loadServerCart();
      return;
    }

    toast.success("Сагс хоослогдлоо.");
    emitCartUpdated();
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-[130px] pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col lg:flex-row gap-10">
        {/* LEFT */}
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 bg-[#111]/90 border border-gray-800 rounded-3xl p-8 shadow-xl"
        >
          <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
            <h1 className="text-3xl font-bold">🛒 Таны сагс</h1>

            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="flex items-center gap-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
                Хоослох
              </button>
            )}
          </div>

          {items.length > 0 ? (
            <div className="space-y-6">
              {items.map((item, i) => (
                <div
                  key={
                    item.id ?? `${item.foodId}-${item.selectedSize ?? "def"}`
                  }
                  className="flex justify-between items-center border-b border-gray-800 pb-6"
                >
                  <div className="flex items-center gap-5">
                    <img
                      src={item.food.image}
                      alt={item.food.foodName}
                      className="w-24 h-24 rounded-2xl border border-gray-700 object-cover"
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

                  <div className="flex flex-col items-end gap-2">
                    <p className="font-semibold text-[#facc15] text-lg">
                      {(item.food.price * item.quantity).toLocaleString()}₮
                    </p>

                    <div className="flex items-center rounded-full bg-[#1c1c1c] border border-gray-700 overflow-hidden">
                      <button
                        onClick={() => updateQuantity(i, -1)}
                        className="px-3 py-1.5 hover:bg-[#2a2a2a]"
                      >
                        <Minus className="w-4 h-4 text-gray-300" />
                      </button>

                      <span className="px-4 py-1 bg-[#facc15] text-black font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(i, 1)}
                        className="px-3 py-1.5 hover:bg-[#2a2a2a]"
                      >
                        <Plus className="w-4 h-4 text-gray-300" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(i)}
                      className="text-red-400 text-xs hover:underline"
                    >
                      Устгах
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center mt-20 text-lg">
              🛍 Сагс хоосон байна.
            </p>
          )}
        </motion.section>

        {/* RIGHT */}
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-[420px] bg-[#111]/90 border border-gray-800 rounded-3xl p-8 shadow-xl h-fit"
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

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/checkout?step=info")}
            className="w-full mt-8 py-4 rounded-xl bg-gradient-to-r from-[#facc15] to-[#fbbf24] text-black font-semibold text-lg shadow-lg"
          >
            Үргэлжлүүлэх
          </motion.button>
        </motion.section>
      </div>
    </main>
  );
}
