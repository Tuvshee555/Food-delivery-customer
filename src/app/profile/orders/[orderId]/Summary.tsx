"use client";

import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { OrderDetails } from "./types";

export const Summary = ({
  order,
  onUpdated,
}: {
  order: OrderDetails;
  onUpdated: () => void;
}) => {
  const router = useRouter();

  const canCancel = order.status === "PENDING";

  const handleCancel = async () => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/${order.id}`,
        { status: "CANCELLED" }
      );
      toast.success("Захиалга цуцлагдлаа!");
      onUpdated();
    } catch {
      toast.error("Цуцлахад алдаа гарлаа!");
    }
  };

  const handleReorder = () => {
    router.push(`/food?reorder=${order.id}`);
  };

  return (
    <div className="bg-[#111] p-5 rounded-xl border border-gray-800">
      <div className="flex justify-between text-lg text-gray-300 mb-3">
        <span>Хоол</span>
        <span>{order.totalPrice.toLocaleString()}₮</span>
      </div>

      <div className="border-t border-gray-700 my-4" />

      <div className="flex justify-between items-center text-xl font-bold">
        <span>Нийт</span>
        <span className="text-[#facc15]">
          {order.totalPrice.toLocaleString()}₮
        </span>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          onClick={handleReorder}
          className="w-full py-3 rounded-xl bg-[#222] border border-[#facc15] text-[#facc15]"
        >
          Дахин захиалах
        </button>

        {canCancel && (
          <button
            onClick={handleCancel}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700"
          >
            Цуцлах
          </button>
        )}
      </div>
    </div>
  );
};
