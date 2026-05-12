// src/hooks/useFoods.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FoodType } from "@/type/type";
import { sanitizeFoodList } from "@/utils/catalogSanitizer";

export function useFood() {
  return useQuery<FoodType[]>({
    queryKey: ["foods"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/food`
      );
      return sanitizeFoodList(Array.isArray(data) ? data : []);
    },
    staleTime: 10 * 60_000,
    gcTime: 30 * 60_000,
  });
}
