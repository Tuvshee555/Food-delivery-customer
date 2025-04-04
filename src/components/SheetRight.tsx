import { ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { PayFood } from "./PayFood";
import { OrderHistory } from "./OrderHistory";

export const SheetRight = () => {
  const [page, setPage] = useState<number>(1);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="border rounded-full h-full items-center w-[44px] flex justify-center bg-[white] hover:cursor-pointer">
          {/* No need to call SheetRight() here */}
          <ShoppingCart />
        </div>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[538px] p-[32px] bg-[#404040] flex flex-col gap-6">
        <SheetHeader>
          <div className="flex gap-3">
            <SheetTitle>
              <ShoppingCart />
            </SheetTitle>
            <SheetTitle>Order detail</SheetTitle>
          </div>
        </SheetHeader>
        <div className="h-[44px] w-full bg-white p-1 gap-2 rounded-full flex">
          <div
            className={`w-full h-full rounded-full flex items-center justify-center ${
              page === 1
                ? "text-white bg-red-500"
                : "text-black border-[1px] border-[black]"
            }`}
            onClick={() => setPage(1)}
          >
            Card
          </div>
          <div
            className={`w-full h-full rounded-full flex items-center justify-center ${
              page === 2
                ? "text-white bg-red-500"
                : "text-black border-[1px] border-[black]"
            }`}
            onClick={() => setPage(2)}
          >
            Order
          </div>
        </div>

        {page === 1 && <PayFood />}
        {page === 2 && <OrderHistory />}
      </SheetContent>
    </Sheet>
  );
};
