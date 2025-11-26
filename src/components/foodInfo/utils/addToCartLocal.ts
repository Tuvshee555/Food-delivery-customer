/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";

export const addToCartLocal = ({
  food,
  quantity,
  selectedSize,
}: {
  food: any;
  quantity: number;
  selectedSize: string | null;
}) => {
  if (Array.isArray(food.sizes) && food.sizes.length > 0 && !selectedSize) {
    toast.error("⚠️ Хэмжээг сонгоно уу.");
    return false;
  }

  if (!food.id) {
    toast.error("❌ Хоолны ID олдсонгүй.");
    return false;
  }

  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const exist = cart.find(
    (item: any) => item.foodId === food.id && item.selectedSize === selectedSize
  );

  if (exist) {
    exist.quantity += quantity;
  } else {
    cart.push({
      foodId: food.id,
      quantity,
      selectedSize,
      food: {
        id: food.id,
        foodName: food.foodName,
        price: food.price,
        image: typeof food.image === "string" ? food.image : "",
      },
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("cart-updated", Date.now().toString());
  window.dispatchEvent(new CustomEvent("cart-updated"));

  toast.success("🛒 Амжилттай сагсанд нэмэгдлээ!");

  return true;
};
