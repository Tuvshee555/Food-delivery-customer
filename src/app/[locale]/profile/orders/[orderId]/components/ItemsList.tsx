"use client";

import Image from "next/image";
import { Utensils } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { OrderItem } from "./types";
import { AddReviewModal } from "./AddReviewModal";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

export const ItemsList = ({
  items,
  token,
}: {
  items: OrderItem[];
  token: string | null;
}) => {
  const { t } = useI18n();

  const [reviewTarget, setReviewTarget] = useState<{
    foodId: string;
    foodName: string;
  } | null>(null);

  return (
    <>
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Utensils className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">
            {t("ordered_foods") ?? "Ordered foods"}
          </h3>
        </div>

        <div className="divide-y divide-border/50">
          {items.map((item) => {
            const price = item.food.price ?? 0;
            const total = price * item.quantity;

            return (
              <div key={item.id} className="flex gap-4 py-3 items-center">
                <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border">
                  {item.food.image ? (
                    <Image
                      src={item.food.image}
                      alt={item.food.foodName}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-medium truncate">
                    {item.food.foodName}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {price}₮ × {item.quantity}
                  </p>

                  <button
                    onClick={() => {
                      if (!token) {
                        toast.error(
                          t("login_to_review") ??
                            "Please login to leave a review.",
                        );
                        return;
                      }

                      setReviewTarget({
                        foodId: item.food.id,
                        foodName: item.food.foodName,
                      });
                    }}
                    className="mt-1 inline-flex h-[36px] px-3 rounded-md border border-border bg-background text-xs font-medium"
                  >
                    {t("write_review") ?? "Write a review"}
                  </button>
                </div>

                <div className="text-sm font-medium whitespace-nowrap">
                  {total}₮
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ✅ Review modal */}
      {reviewTarget && token && (
        <AddReviewModal
          open={!!reviewTarget}
          onClose={() => setReviewTarget(null)}
          token={token}
          foodId={reviewTarget.foodId}
          foodName={reviewTarget.foodName}
          onSuccess={() => {}}
        />
      )}
    </>
  );
};
