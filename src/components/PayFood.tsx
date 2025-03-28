import { useEffect, useState } from "react";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export const PayFood = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(storedCart);

    // Calculate total price
    const total = storedCart.reduce((sum: number, item: any) => sum + item.food.price * item.quantity, 0);
    setTotalPrice(total);
  }, []);

  return (
    <>
      <div className="w-full bg-white rounded-[10px] p-[16px] shadow-lg">
        <h1 className="text-lg font-semibold mb-4">My Cart</h1>

        <div className="mt-2 space-y-4 max-h-[300px] overflow-y-auto">
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4">
                {/* Food Image */}
                <img 
                  src={item.food.image} 
                  className="w-[64px] h-[64px] rounded-lg object-cover" 
                  alt={item.food.foodName} 
                />

                {/* Food Details */}
                <div className="flex flex-col flex-1 ml-4">
                  <span className="text-red-500 font-semibold text-base">{item.food.foodName}</span>
                  <span className="text-gray-600 text-sm">x{item.quantity}</span>
                </div>

                {/* Price */}
                <span className="font-semibold text-lg">${(item.food.price * item.quantity).toFixed(2)}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">Your cart is empty</p>
          )}
        </div>

        {/* Total Price Section */}
        {cartItems.length > 0 && (
          <div className="mt-6 flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Checkout Button */}
      <SheetFooter className="mt-4">
        <SheetClose asChild>
          <Button className="bg-red-500 text-white w-full rounded-lg py-3 text-lg font-semibold">
            Proceed to Checkout
          </Button>
        </SheetClose>
      </SheetFooter>
    </>
  );
};
