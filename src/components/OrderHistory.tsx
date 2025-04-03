import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { Button } from "./ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/app/provider/AuthProvider";

type OrderType = {
  _id: string;
  totalprice: number;
  createdAt: string;
  foodOrderItems: {
    foodId: {
      _id: string;
      foodName: string;
    };
    quantity: number;
  }[];
  status: string;
  foodName: string;
};

export const OrderHistory = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const { userId } = useAuth();
  console.log("userID", userId);

  const getOrders = async () => {
    try {
      if (!userId) {
        toast.error("User ID is not available.");
        return;
      }

      const response = await axios.get(`http://localhost:4000/order/${userId}`);
      setOrders(response.data);
      console.log(response.data, "order data");
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    if (userId) {
      getOrders();
    }
  }, [userId]);

  return (
    <div className="w-full bg-white rounded-lg p-4 shadow-lg">
      <h1 className="text-lg font-semibold mb-4">Order History</h1>
      {orders.length > 0 ? (
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded-lg shadow-sm">
              <div className="flex justify-between">
                <span className="text-lg font-semibold">
                  ${order.totalprice.toFixed(2)}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === "PENDING"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="text-gray-600 text-sm mt-2">
                Order ID: {order._id}
              </div>
              <div className="text-gray-600 text-sm">
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </div>
              <ul className="mt-2 text-sm">
                {order.foodOrderItems.map((item) => (
                  <li
                    key={item.foodId.foodName}
                    className="flex justify-between border-b py-1"
                  >
                    <span>Food name: {item.foodId.foodName}</span>
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
            type="submit"
            className="bg-red-500 text-white w-full rounded-lg py-3 text-lg font-semibold"
          >
            Close
          </Button>
        </SheetClose>
      </SheetFooter>
    </div>
  );
};
