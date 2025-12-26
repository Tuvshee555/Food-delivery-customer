"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

import { CartItem } from "@/type/type";

import { useAuth } from "@/app/[locale]/provider/AuthProvider";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
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
} from "../helpers";

export function useCartLogic() {
  const { userId, token, loading } = useAuth();
  const { t } = useI18n();

  const [items, setItems] = useState<CartItem[]>([]);

  const loadLocalCart = useCallback(() => {
    setItems(loadLocalCartHelper());
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

  const updateQuantity = async (item: CartItem, change: number) => {
    const nextQty = Math.max(1, item.quantity + change);

    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, quantity: nextQty } : i))
    );

    if (!userId || !token) {
      updateLocalQtyHelper(item, nextQty);
      return;
    }

    if (!item.id) {
      toast.error(t("cart.itemIdError"));
      await loadServerCart();
      return;
    }

    const ok = await updateQtyHelper(item.id, nextQty);
    if (!ok) await loadServerCart();

    window.dispatchEvent(new Event("cart-updated"));
  };

  const removeItem = async (item: CartItem) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));

    if (!userId || !token) {
      removeLocalHelper(item);
      toast.success(t("cart.itemRemoved"));
      return;
    }

    if (!item.id) {
      toast.error(t("cart.itemIdError"));
      await loadServerCart();
      return;
    }

    const ok = await removeItemHelper(item.id);
    if (!ok) await loadServerCart();
    else toast.success(t("cart.itemRemoved"));

    window.dispatchEvent(new Event("cart-updated"));
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

  const total = items.reduce((sum, i) => sum + i.food.price * i.quantity, 0);

  return {
    items,
    loading,
    total,
    updateQuantity,
    removeItem,
    clearCart,
  };
}
