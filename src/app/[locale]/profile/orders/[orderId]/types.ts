/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";

export type OrderStatus =
  | "PENDING"
  | "WAITING_PAYMENT"
  | "COD_PENDING"
  | "PAID"
  | "DELIVERING"
  | "DELIVERED"
  | "CANCELLED";

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
  qpay: any;
  deliveryFee: any;
  delivery: any;
  orderNumber: ReactNode;
  paymentMethod: ReactNode;
  id: string;
  totalPrice: number;
  createdAt: string;
  location: string;
  status: OrderStatus;
  items: OrderItem[];
};
