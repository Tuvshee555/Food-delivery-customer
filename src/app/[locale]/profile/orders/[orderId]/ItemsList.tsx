import { OrderItem } from "./types";

export const ItemsList = ({ items }: { items: OrderItem[] }) => (
  <div className="bg-[#111] p-5 rounded-xl border border-gray-800 mb-6">
    <h3 className="text-gray-300 font-medium mb-3">Захиалсан хоолнууд</h3>
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="flex justify-between text-gray-400">
          <span>🍽 {item.food.foodName}</span>
          <span>× {item.quantity}</span>
        </div>
      ))}
    </div>
  </div>
);
