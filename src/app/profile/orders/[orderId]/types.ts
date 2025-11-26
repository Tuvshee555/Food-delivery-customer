export type OrderStatus = "PENDING" | "DELIVERED" | "CANCELLED";

export type OrderItem = {
  id: string;
  quantity: number;
  food: {
    foodName: string;
    price: number;
    image: string;
  };
};

export type OrderDetails = {
  id: string;
  totalPrice: number;
  createdAt: string;
  location: string;
  status: OrderStatus;
  items: OrderItem[];
};
