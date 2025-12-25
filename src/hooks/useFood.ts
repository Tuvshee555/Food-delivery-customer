// src/hooks/useFoods.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FoodType } from "@/type/type";

export function useFood() {
  return useQuery<FoodType[]>({
    queryKey: ["foods"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/food`
      );
      return data;
    },
  });
}
