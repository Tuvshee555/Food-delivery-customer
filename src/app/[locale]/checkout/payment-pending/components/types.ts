export type OrderItem = {
  quantity: number;
  food: {
    foodName: string;
    price: number;
    image: string;
  };
};

export type OrderData = {
  status: string;
  paymentMethod: string;
  id?: string;
  totalPrice?: number;
  deliveryFee?: number;
  productTotal?: number;
  items?: OrderItem[];
};
