import { CartItem } from "@/type/type";
import { toast } from "sonner";

export const calculateTotal = (items: CartItem[]): number =>
  items.reduce((sum, i) => sum + i.food.price * i.quantity, 0);

/* Load LOCAL cart */
export const loadLocalCartHelper = (): CartItem[] => {
  return JSON.parse(localStorage.getItem("cart") || "[]");
};

/* Load SERVER cart */
export const loadServerCartHelper = async (
  userId: string,
  token: string
): Promise<CartItem[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    return data.items || [];
  } catch {
    toast.error("Сагс ачаалахад алдаа гарлаа.");
    return [];
  }
};

/* Update quantity LOCAL */
export const updateLocalQtyHelper = (item: CartItem, newQty: number): void => {
  const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

  const found = cart.find(
    (i) => i.foodId === item.foodId && i.selectedSize === item.selectedSize
  );
  if (!found) return;

  found.quantity = newQty;

  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("cart-updated", Date.now().toString());
  window.dispatchEvent(new Event("cart-updated"));
};

/* Update quantity SERVER */
export const updateServerQtyHelper = async (
  id: string | undefined,
  quantity: number,
  token: string
): Promise<boolean> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, quantity }),
      }
    );

    if (!res.ok) {
      toast.error("Сагс шинэчлэхэд алдаа гарлаа.");
      return false;
    }

    localStorage.setItem("cart-updated", Date.now().toString());
    window.dispatchEvent(new Event("cart-updated"));

    return true;
  } catch {
    toast.error("Сүлжээ алдаа.");
    return false;
  }
};

/* Remove LOCAL */
export const removeLocalHelper = (item: CartItem): void => {
  const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

  const filtered = cart.filter(
    (i) => !(i.foodId === item.foodId && i.selectedSize === item.selectedSize)
  );

  localStorage.setItem("cart", JSON.stringify(filtered));
  localStorage.setItem("cart-updated", Date.now().toString());
  window.dispatchEvent(new Event("cart-updated"));
};

/* Remove SERVER */
export const removeServerHelper = async (
  id: string | undefined,
  token: string
): Promise<boolean> => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });

    localStorage.setItem("cart-updated", Date.now().toString());
    window.dispatchEvent(new Event("cart-updated"));

    return true;
  } catch {
    toast.error("Сүлжээ алдаа.");
    return false;
  }
};

/* Clear LOCAL */
export const clearLocalHelper = (): void => {
  localStorage.removeItem("cart");
  localStorage.setItem("cart-updated", Date.now().toString());
  window.dispatchEvent(new Event("cart-updated"));
};

/* Clear SERVER */
export const clearServerHelper = async (
  userId: string,
  token: string
): Promise<boolean> => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/clear`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });

    localStorage.setItem("cart-updated", Date.now().toString());
    window.dispatchEvent(new Event("cart-updated"));

    return true;
  } catch {
    toast.error("Сүлжээ алдаа.");
    return false;
  }
};
