"use client";

import { useState, useEffect, useCallback } from "react";
import { SheetFooter } from "@/components/ui/sheet";
import { CartItem } from "@/type/type";
import { CartItemRow } from "./CartItemRow";
import { CartSummary } from "./CartSummary";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { useAuth } from "@/app/[locale]/provider/AuthProvider";

import {
  calculateTotal,
  loadLocalCartHelper,
  loadServerCartHelper,
  updateLocalQtyHelper,
  updateServerQtyHelper,
  removeLocalHelper,
  removeServerHelper,
  clearLocalHelper,
  clearServerHelper,
} from "./helpers";

export const PayFood = () => {
  const { userId, token } = useAuth();
  const { t } = useI18n();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const refreshTotals = (items: CartItem[]) => {
    setTotalPrice(calculateTotal(items));
  };

  const loadLocalCart = useCallback(() => {
    const cart = loadLocalCartHelper();
    setCartItems(cart);
    refreshTotals(cart);
  }, []);

  const loadServerCart = useCallback(async () => {
    if (!userId || !token) return;
    const items = await loadServerCartHelper(userId, token);
    setCartItems(items);
    refreshTotals(items);
  }, [userId, token]);

  useEffect(() => {
    const handler = () => {
      if (!userId || !token) loadLocalCart();
      else loadServerCart();
    };

    handler();
    window.addEventListener("cart-updated", handler);
    return () => window.removeEventListener("cart-updated", handler);
  }, [userId, token, loadLocalCart, loadServerCart]);

  const updateQuantity = async (item: CartItem, change: number) => {
    const newQty = Math.max(1, item.quantity + change);

    if (!userId || !token) {
      updateLocalQtyHelper(item, newQty);
      return;
    }

    await updateServerQtyHelper(item.id, newQty, token);
  };

  const removeItem = async (item: CartItem) => {
    if (!userId || !token) {
      removeLocalHelper(item);
      return;
    }

    await removeServerHelper(item.id, token);
  };

  const clearAll = async () => {
    if (!userId || !token) {
      clearLocalHelper();
      return;
    }

    await clearServerHelper(userId, token);
  };

  return (
    <>
      {/* CONTENT (FLAT – NO CARD) */}
      <div className="flex flex-col gap-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-foreground">
            {t("your_cart")}
          </h1>

          {cartItems.length > 0 && (
            <button
              onClick={clearAll}
              className="text-sm text-muted-foreground hover:text-destructive transition"
            >
              {t("clear_cart")}
            </button>
          )}
        </div>

        {/* ITEMS */}
        <div className="space-y-5 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <CartItemRow
                key={item.id || item.foodId}
                item={item}
                onUpdateQty={updateQuantity}
                onRemove={removeItem}
              />
            ))
          ) : (
            <p className="text-muted-foreground text-center py-10">
              {t("cart_empty")}
            </p>
          )}
        </div>

        {/* SUMMARY */}
        {cartItems.length > 0 && <CartSummary total={totalPrice} />}
      </div>

      <SheetFooter />
    </>
  );
};
