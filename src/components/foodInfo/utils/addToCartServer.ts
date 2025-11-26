import { toast } from "sonner";

export const addToCartServer = async ({
  foodId,
  userId,
  token,
  quantity,
  selectedSize,
}: {
  foodId: string;
  userId: string;
  token: string;
  quantity: number;
  selectedSize: string | null;
}) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId,
        foodId,
        quantity,
        selectedSize: selectedSize || null,
      }),
    });

    if (!res.ok) {
      toast.error("Сервер руу нэмэхэд алдаа гарлаа.");
      return false;
    }

    localStorage.setItem("cart-updated", Date.now().toString());
    window.dispatchEvent(new CustomEvent("cart-updated"));

    toast.success("🛒 Сагс руу нэмэгдлээ!");

    return true;
  } catch {
    toast.error("Сүлжээ алдаа. Дахин оролдоно уу.");
    return false;
  }
};
