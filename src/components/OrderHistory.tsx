"use client";

import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { Button } from "./ui/button";
import axios from "axios";
import { Key, ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/app/provider/AuthProvider";

type OrderType = {
  location: ReactNode;
  id: string;
  totalPrice: number;
  createdAt: string;
  foodOrderItems: {
    id: Key | null | undefined;
    food: {
      id: string;
      foodName: string;
    };
    quantity: number;
  }[];
  status: "PENDING" | "DELIVERED" | "CANCELLED";
};

export const OrderHistory = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const { userId } = useAuth();

  const getOrders = async () => {
    try {
      if (!userId) {
        toast.error("User ID is not available.");
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/user/${userId}`
      );
      setOrders(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    if (userId) getOrders();
  }, [userId]);

  const getStatusColor = (status: OrderType["status"]) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "DELIVERED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "";
    }
  };

  return (
    <div className="w-full bg-white rounded-lg p-4 shadow-lg">
      <h1 className="text-lg font-semibold mb-4">Order History</h1>
      {orders.length > 0 ? (
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {orders.map((order) => (
            <div key={order.id} className="border p-4 rounded-lg shadow-sm">
              <div className="flex justify-between">
                <span className="text-lg font-semibold">
                  ${order.totalPrice.toFixed(2)}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>
              <div className="text-gray-600 text-sm mt-2">
                Order ID: {order.id}
              </div>
              <div className="text-gray-600 text-sm">
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </div>
              <div className="text-gray-600 text-sm mt-1">
                Delivery: {order.location}
              </div>
              <ul className="mt-2 text-sm">
                {order.foodOrderItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between border-b py-1"
                  >
                    <span>Food name: {item.food.foodName}</span>
                    <span>Qty: {item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No orders found.</p>
      )}
      <SheetFooter className="mt-4">
        <SheetClose asChild>
          <Button
            type="button"
            className="bg-red-500 text-white w-full rounded-lg py-3 text-lg font-semibold"
          >
            Close
          </Button>
        </SheetClose>
      </SheetFooter>
    </div>
  );
};
