import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Minus } from "lucide-react";
import { AddFoodOrderProps } from "@/type/type";
import { toast } from "sonner";

export const AddFoodOrder: React.FC<AddFoodOrderProps> = ({ food }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(food.price);

  const handleIncrease = (): void => {
    setQuantity((prev) => prev + 1);
    setTotalPrice(food.price * (quantity + 1));
  };
  const handleDecrease = (): void => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
    setTotalPrice(food.price * (quantity - 1));
  };

  const createOrder = async () => {
    try {
      const cart = localStorage.getItem("cart");
      if (cart) {
        const cartItems = JSON.parse(cart);
        const newCart = [...cartItems, { food: food, quantity: quantity }];
        localStorage.setItem("cart", JSON.stringify(newCart));
      } else {
        localStorage.setItem(
          "cart",
          JSON.stringify([{ food: food, quantity: quantity }])
        );
      }

      toast("Successully created order");
    } catch (error) {
      console.log(error);
      toast.error("Failed to create order");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="absolute bottom-2 right-2 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg hover:cursor-pointer">
          <Plus className="text-red-500" />
        </div>
      </DialogTrigger>
      <DialogContent className="w-[826px] h-[412px] p-0 flex overflow-hidden rounded-lg">
        {/* Left Side - Food Image */}
        <div className="w-[377px] h-[412px]">
          <img
            className="w-full h-full object-cover"
            src={food.image}
            alt={food.foodName}
          />
        </div>

        {/* Right Side - Food Details */}
        <div className="flex flex-col flex-1 p-[26px]">
          <div className="flex flex-col justify-between h-[300px]">
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-red-500 text-lg font-semibold">
                  {food.foodName}
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  {food.ingredients}
                </DialogDescription>
              </div>
            </div>

            {/* Price & Quantity */}
            <div className="flex flex-col gap-6 mt-6">
              <div>
                <h3 className="text-gray-600 text-sm">Total price</h3>
                <h2 className="text-xl font-semibold">
                  ${(food.price * quantity).toFixed(2)}
                </h2>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleDecrease}
                  className="border border-gray-400 rounded-full p-2 hover:bg-gray-100"
                >
                  <Minus />
                </button>
                <span className="text-lg font-semibold">{quantity}</span>
                <button
                  onClick={handleIncrease}
                  className="border border-gray-400 rounded-full p-2 hover:bg-gray-100"
                >
                  <Plus />
                </button>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <DialogFooter className="mt-auto">
            <Button
              className="bg-black text-white rounded-lg w-full p-3"
              onClick={() => createOrder()}
            >
              Add to cart
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
