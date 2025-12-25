// src/hooks/useCategory.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Datas } from "@/type/type";

export function useCategory() {
  return useQuery<Datas[]>({
    queryKey: ["category"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/category`
      );
      return data;
    },
    staleTime: 10 * 60_000, // explained below
    gcTime: 30 * 60_000,
  });
}
