import axios from "axios";
import { toast } from "sonner";
import { CartItem } from "./types";

export const notifyCartUpdated = () => {
  localStorage.setItem("cart-updated", Date.now().toString());
  window.dispatchEvent(new Event("cart-updated"));
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
