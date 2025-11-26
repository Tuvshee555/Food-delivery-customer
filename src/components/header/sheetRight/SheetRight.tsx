"use client";

import { ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartSync } from "./components/useCartSync";
import { CartButton } from "./components/CartButton";
import { PayFood } from "./payfood/PayFood";

export const SheetRight = () => {
  const cartCount = useCartSync();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <CartButton count={cartCount} />
      </SheetTrigger>

      <SheetContent
        key={cartCount}
        className="sm:max-w-[538px] p-[32px] bg-[#101010] border-l border-gray-800 text-white flex flex-col gap-6"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-[#facc15] text-lg">
            <ShoppingCart className="w-5 h-5" />
            Сагс
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto custom-scrollbar mt-2">
          <PayFood key={cartCount} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
