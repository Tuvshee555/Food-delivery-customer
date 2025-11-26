"use client";

import { Button } from "@/components/ui/button";

export const CartSummary = ({ total }: { total: number }) => {
  return (
    <div className="pt-4 border-t border-gray-800">
      <div className="flex justify-between text-lg font-semibold mb-4">
        <span>Нийт дүн</span>
        <span className="text-[#facc15]">₮ {total.toLocaleString()}</span>
      </div>

      <Button
        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#facc15] to-[#fbbf24] text-black font-semibold text-lg"
        onClick={() => (window.location.href = "/checkout")}
      >
        Төлбөр төлөх
      </Button>
    </div>
  );
};
