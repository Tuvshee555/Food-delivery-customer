// src/hooks/useCategoryTree.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { sanitizeCategory } from "@/utils/catalogSanitizer";

export type CategoryNode = {
  id: string;
  categoryName: string;
  parentId: string | null;
  children?: CategoryNode[];
};

const sanitizeNode = (node: CategoryNode): CategoryNode => ({
  ...sanitizeCategory(node),
  children: Array.isArray(node.children)
    ? node.children.map(sanitizeNode)
    : undefined,
});

export function useCategoryTree() {
  return useQuery<CategoryNode[]>({
    queryKey: ["category-tree"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/tree`
      );
      return Array.isArray(data) ? data.map(sanitizeNode) : [];
    },
    staleTime: 30 * 60_000, // tree rarely changes
    gcTime: 60 * 60_000,
  });
}
