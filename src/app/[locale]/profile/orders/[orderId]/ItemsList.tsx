import { OrderItem } from "./types";
import { Utensils } from "lucide-react";

export const ItemsList = ({ items }: { items: OrderItem[] }) => {
  return (
    <div
      className="
        bg-card
        border border-border
        rounded-xl
        p-4 sm:p-5
        mb-6
        space-y-4
      "
    >
      {/* Title */}
      <div className="flex items-center gap-2">
        <Utensils className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">Захиалсан хоолнууд</h3>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="
              flex items-center justify-between
              text-sm
              border-b border-border/50
              pb-2 last:border-0 last:pb-0
            "
          >
            <span className="truncate">{item.food.foodName}</span>

            <span className="text-muted-foreground">× {item.quantity}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
