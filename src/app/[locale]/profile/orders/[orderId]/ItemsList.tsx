"use client";

import Image from "next/image";
import { Utensils } from "lucide-react";
import { OrderItem } from "./types";

export const ItemsList = ({ items }: { items: OrderItem[] }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4">
      {/* Title */}
      <div className="flex items-center gap-2">
        <Utensils className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">Захиалсан хоолнууд</h3>
      </div>

      {/* Items */}
      <div className="divide-y divide-border/50">
        {items.map((item) => {
          const price = item.food.price ?? 0;
          const total = price * item.quantity;

          return (
            <div key={item.id} className="flex gap-4 py-3 items-center">
              {/* Image */}
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

              {/* Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-sm font-medium truncate">
                  {item.food.foodName}
                </p>

                <p className="text-xs text-muted-foreground">
                  {price}₮ × {item.quantity}
                </p>
              </div>

              {/* Total */}
              <div className="text-sm font-medium whitespace-nowrap">
                {total}₮
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
