// src/hooks/useCategoryTree.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type CategoryNode = {
  id: string;
  categoryName: string;
  parentId: string | null;
  children?: CategoryNode[];
};

export function useCategoryTree() {
  return useQuery<CategoryNode[]>({
    queryKey: ["category-tree"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/tree`
      );
      return data;
    },
    staleTime: 30 * 60_000, // tree rarely changes
    gcTime: 60 * 60_000,
  });
}
