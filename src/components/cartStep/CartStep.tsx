"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

import { classes } from "./styles";
import { CartList } from "./CartList";
import { CartSummary } from "./CartSummary";
import { useAuth } from "@/app/[locale]/provider/AuthProvider";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

export default function CartStep() {
  const { userId, token, loading } = useAuth();
  const router = useRouter();
  const { locale, t } = useI18n();
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

    (async () => {
      await syncLocalCart();
      await loadServerCart();
    })();
  }, [loading, token, userId, syncLocalCart, loadServerCart, loadLocalCart]);

  useEffect(() => {
    const handler = () => {
      if (!token || !userId) loadLocalCart();
      else loadServerCart();
    };

    window.addEventListener("cart-updated", handler);
    window.addEventListener("storage", handler);

    return () => {
      window.removeEventListener("cart-updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, [token, userId, loadLocalCart, loadServerCart]);

  if (loading) {
    return <p className="p-10 text-muted-foreground">{t("loading")}</p>;
  }

  const total = items.reduce((sum, i) => sum + i.food.price * i.quantity, 0);

  const updateQuantity = async (index: number, change: number) => {
    const target = items[index];
    const newQty = target.quantity + change;
    if (newQty < 1) return;

    const updated = [...items];
    updated[index] = { ...target, quantity: newQty };
    setItems(updated);

    if (!userId || !token) {
      updateLocalQtyHelper(target, newQty);
      return;
    }

    if (!target.id) {
      toast.error(t("cart.itemIdError"));
      await loadServerCart();
      return;
    }

    const ok = await updateQtyHelper(target.id, newQty);
    if (!ok) await loadServerCart();
  };

  const removeItem = async (index: number) => {
    const target = items[index];
    setItems((prev) => prev.filter((_, i) => i !== index));

    if (!userId || !token) {
      removeLocalHelper(target);
      toast.success(t("cart.itemRemoved"));
      return;
    }

    if (!target.id) {
      toast.error(t("cart.itemIdError"));
      await loadServerCart();
      return;
    }

    const ok = await removeItemHelper(target.id);
    if (!ok) await loadServerCart();
    else toast.success(t("cart.itemRemoved"));
  };

  const clearCart = async () => {
    setItems([]);

    if (!userId || !token) {
      clearLocalHelper();
      toast.success(t("cart.cleared"));
      return;
    }

    const ok = await clearCartHelper(userId);
    if (!ok) await loadServerCart();
    else toast.success(t("cart.cleared"));
  };

  return (
    <main className={classes.page}>
      <div className={classes.wrapper}>
        {/* LEFT – CART ITEMS */}
        <motion.section
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className={classes.leftCard}
        >
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6 border-b border-border pb-3">
            <h1 className="text-xl sm:text-2xl font-semibold">
              {t("cart.yourCart")}
            </h1>

            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition"
              >
                <Trash2 className="w-4 h-4" />
                {t("cart.clear")}
              </button>
            )}
          </div>

          <CartList
            items={items}
            onUpdateQty={updateQuantity}
            onRemove={removeItem}
          />
        </motion.section>

        {/* RIGHT – SUMMARY */}
        <motion.section
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          className={classes.rightCard}
        >
          <CartSummary
            total={total}
            delivery={100}
            onCheckout={() => router.push(`/${locale}/checkout?step=info`)}
            onClear={items.length > 0 ? clearCart : undefined}
          />
        </motion.section>
      </div>
    </main>
  );
}
