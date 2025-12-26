"use client";

import { useEffect, useState, useCallback } from "react";
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
  removeLocalHelper,
  removeServerHelper,
  clearLocalHelper,
  clearServerHelper,
  updateServerQtyHelper,
  updateLocalQtyHelper,
} from "./helpers";

export const PayFood = () => {
  const { userId, token } = useAuth();
  const { t } = useI18n();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD CART ---------------- */

  const loadCart = useCallback(async () => {
    setLoading(true);

    let items: CartItem[] = [];

    if (!userId || !token) {
      items = loadLocalCartHelper();
    } else {
      items = await loadServerCartHelper(userId, token);
    }

    setCartItems(items);
    setTotalPrice(calculateTotal(items));
    setLoading(false);
  }, [userId, token]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  /* ---------------- PERSIST LOCAL CART ---------------- */

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
      setTotalPrice(calculateTotal(cartItems));
    }
  }, [cartItems, loading]);

  /* ---------------- FAST QUANTITY UPDATE ---------------- */

  const updateQuantity = async (item: CartItem, change: number) => {
    const nextQty = Math.max(1, item.quantity + change);

    setCartItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, quantity: nextQty } : i))
    );

    if (!userId || !token) {
      updateLocalQtyHelper(item, nextQty);
    } else {
      await updateServerQtyHelper(item.id, nextQty, token);
    }

    window.dispatchEvent(new Event("cart-updated"));
  };

  /* ---------------- REMOVE ITEM ---------------- */

  const removeItem = async (item: CartItem) => {
    setCartItems((prev) => prev.filter((i) => i.id !== item.id));

    if (!userId || !token) {
      removeLocalHelper(item);
    } else {
      removeServerHelper(item.id, token);
    }
  };

  /* ---------------- CLEAR CART ---------------- */

  const clearAll = async () => {
    setCartItems([]);

    if (!userId || !token) {
      clearLocalHelper();
    } else {
      clearServerHelper(userId, token);
    }
  };

  /* ---------------- RENDER ---------------- */

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-foreground">
            {t("your_cart")}
          </h1>

          {!loading && cartItems.length > 0 && (
            <button
              onClick={clearAll}
              className="text-sm text-muted-foreground hover:text-destructive"
            >
              {t("clear_cart")}
            </button>
          )}
        </div>

        {/* ITEMS */}
        <div className="space-y-5 max-h-[360px] overflow-y-auto pr-1">
          {loading ? (
            <p className="text-center py-10 text-muted-foreground">
              {t("loading")}
            </p>
          ) : cartItems.length > 0 ? (
            cartItems.map((item) => (
              <CartItemRow
                key={item.id || `${item.foodId}-${item.selectedSize ?? "d"}`}
                item={item}
                onUpdateQty={updateQuantity}
                onRemove={removeItem}
              />
            ))
          ) : (
            <p className="text-center py-10 text-muted-foreground">
              {t("cart_empty")}
            </p>
          )}
        </div>

        {/* SUMMARY */}
        {!loading && cartItems.length > 0 && <CartSummary total={totalPrice} />}
      </div>

      <SheetFooter />
    </>
  );
};
