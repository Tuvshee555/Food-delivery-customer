import axios from "axios";
import { toast } from "sonner";
import { CartItem } from "@/type/type"; // ⬅ unified source

// Notify sync across components
export const notifyCartUpdated = () => {
  localStorage.setItem("cart-updated", Date.now().toString());
  window.dispatchEvent(new Event("cart-updated"));
};

/* LOAD LOCAL CART */
export const loadLocalCartHelper = (): CartItem[] => {
  try {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
};

/* SYNC LOCAL CART → BACKEND */
export const syncLocalCartHelper = async (
  token: string,
  userId: string
): Promise<void> => {
  const raw = localStorage.getItem("cart");
  if (!raw) return;

  const local: CartItem[] = JSON.parse(raw);
  if (!local.length) return;

  localStorage.setItem("cart-backup", raw);

  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/sync`,
      { userId, items: local },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    localStorage.removeItem("cart");
    localStorage.removeItem("cart-backup");
    notifyCartUpdated();
  } catch {
    const backup = localStorage.getItem("cart-backup");
    if (backup) localStorage.setItem("cart", backup);
    toast.error("Сагс синк хийхэд алдаа гарлаа.");
  }
};

/* LOAD SERVER CART */
export const loadServerCartHelper = async (
  token: string,
  userId: string
): Promise<CartItem[]> => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.items || [];
  } catch {
    toast.error("Сагс ачаалахад алдаа гарлаа.");
    return [];
  }
};

/* UPDATE QUANTITY */
export const updateQtyHelper = async (
  id: string,
  quantity: number
): Promise<boolean> => {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/update`, {
      id,
      quantity,
    });
    notifyCartUpdated();
    return true;
  } catch {
    toast.error("Тоо ширхэг шинэчлэхэд алдаа гарлаа.");
    return false;
  }
};

/* REMOVE ITEM */
export const removeItemHelper = async (id: string): Promise<boolean> => {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/remove`, {
      id,
    });
    notifyCartUpdated();
    return true;
  } catch {
    toast.error("Устгахад алдаа гарлаа.");
    return false;
  }
};

/* CLEAR CART */
export const clearCartHelper = async (userId: string): Promise<boolean> => {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/clear`, {
      userId,
    });
    notifyCartUpdated();
    return true;
  } catch {
    toast.error("Сагс хоослох үед алдаа гарлаа.");
    return false;
  }
};
/* UPDATE QUANTITY (LOCAL) */
export const updateLocalQtyHelper = (item: CartItem, newQty: number): void => {
  try {
    const raw = localStorage.getItem("cart") || "[]";
    const cart = Array.isArray(JSON.parse(raw))
      ? (JSON.parse(raw) as CartItem[])
      : [];

    const matchIndex = cart.findIndex((i) =>
      // prefer matching by server id when present, otherwise match by foodId + size
      i.id && item.id
        ? i.id === item.id
        : i.foodId === item.foodId &&
          (i.selectedSize ?? null) === (item.selectedSize ?? null)
    );

    if (matchIndex === -1) return;

    cart[matchIndex].quantity = Math.max(1, newQty);
    localStorage.setItem("cart", JSON.stringify(cart));
    notifyCartUpdated();
  } catch (err) {
    // fail silently (or optionally console.error)
    console.error("updateLocalQtyHelper error", err);
  }
};

/* REMOVE ITEM (LOCAL) */
export const removeLocalHelper = (item: CartItem): void => {
  try {
    const raw = localStorage.getItem("cart") || "[]";
    const cart = Array.isArray(JSON.parse(raw))
      ? (JSON.parse(raw) as CartItem[])
      : [];

    const filtered = cart.filter((i) =>
      // keep items that are NOT the one we want to remove
      i.id && item.id
        ? i.id !== item.id
        : !(
            i.foodId === item.foodId &&
            (i.selectedSize ?? null) === (item.selectedSize ?? null)
          )
    );

    localStorage.setItem("cart", JSON.stringify(filtered));
    notifyCartUpdated();
  } catch (err) {
    console.error("removeLocalHelper error", err);
  }
};

/* CLEAR LOCAL CART */
export const clearLocalHelper = (): void => {
  try {
    localStorage.removeItem("cart");
    notifyCartUpdated();
  } catch (err) {
    console.error("clearLocalHelper error", err);
  }
};
