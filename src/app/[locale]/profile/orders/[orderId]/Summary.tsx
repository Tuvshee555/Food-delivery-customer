"use client";

import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { OrderDetails } from "./types";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

export const Summary = ({
  order,
  onUpdated,
}: {
  order: OrderDetails;
  onUpdated: () => void;
}) => {
  const router = useRouter();
  const { locale, t } = useI18n();
  const canCancel = order.status === "PENDING";

  const handleCancel = async () => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/${order.id}`,
        { status: "CANCELLED" }
      );
      toast.success(t("order_cancel_success"));
      onUpdated();
    } catch {
      toast.error(t("order_cancel_error"));
    }
  };

  const handleReorder = () => {
    router.push(`/${locale}/food?reorder=${order.id}`);
  };

  return (
    <div className="bg-[#111] p-5 rounded-xl border border-gray-800">
      <div className="flex justify-between text-lg text-gray-300 mb-3">
        <span>{t("order_food_total")}</span>
        <span>{order.totalPrice.toLocaleString()}₮</span>
      </div>

      <div className="border-t border-gray-700 my-4" />

      <div className="flex justify-between items-center text-xl font-bold">
        <span>{t("order_total")}</span>
        <span className="text-[#facc15]">
          {order.totalPrice.toLocaleString()}₮
        </span>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          onClick={handleReorder}
          className="w-full py-3 rounded-xl bg-[#222] border border-[#facc15] text-[#facc15]"
        >
          {t("reorder")}
        </button>

        {canCancel && (
          <button
            onClick={handleCancel}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700"
          >
            {t("cancel")}
          </button>
        )}
      </div>
    </div>
  );
};
