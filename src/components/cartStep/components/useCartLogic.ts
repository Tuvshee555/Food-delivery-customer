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
