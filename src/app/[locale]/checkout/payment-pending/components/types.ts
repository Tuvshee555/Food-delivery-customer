export type OrderItem = {
  quantity: number;
  food: {
    foodName: string;
    price: number;
    image: string;
  };
};

export type OrderData = {
  id?: string;
  totalPrice?: number;
  deliveryFee?: number;
  productTotal?: number;
  items?: OrderItem[];
};
