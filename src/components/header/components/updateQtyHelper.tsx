import { CartItem } from "@/type/type";

export const updateLocalQtyHelper = (item: CartItem, qty: number) => {
  const raw = localStorage.getItem("cart") || "[]";
  const cart = JSON.parse(raw);

  const updated = cart.map((i: CartItem) =>
    i.id === item.id ? { ...i, quantity: qty } : i
  );

  localStorage.setItem("cart", JSON.stringify(updated));
};

export const updateServerQtyHelper = async (
  itemId: string,
  qty: number,
  token: string
) => {
  await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/item/${itemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity: qty }),
  });
};
