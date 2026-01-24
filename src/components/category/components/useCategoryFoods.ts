/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { FoodType } from "@/type/type";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

type SortType = "newest" | "oldest" | "low" | "high";

type Filters = {
  discount: boolean;
  featured: boolean;
  bestseller: boolean;
};

const PER_PAGE = 8;
const BESTSELLER_THRESHOLD = 20;

function isDiscounted(item: any) {
  return Number(item?.discount ?? 0) > 0;
}

function isFeatured(item: any) {
  return Boolean(item?.isFeatured);
}

function isBestseller(item: any) {
  return Number(item?.salesCount ?? 0) >= BESTSELLER_THRESHOLD;
}

export function useCategoryLogic(id: string) {
  const { t } = useI18n();

  const [foods, setFoods] = useState<FoodType[]>([]);
  const [categoryName, setCategoryName] = useState(t("category"));
  const [page, setPage] = useState(1);
  const [sortType, setSortType] = useState<SortType>("newest");
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState<Filters>({
    discount: false,
    featured: false,
    bestseller: false,
  });

  const toggleFilter = (k: keyof Filters) =>
    setFilters((p) => ({ ...p, [k]: !p[k] }));

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    async function fetchAll() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/food`, {
        signal: controller.signal,
      });
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }

    async function run() {
      try {
        if (["all", "featured", "discounted", "bestseller"].includes(id)) {
          const map = {
            all: () => {
              setFilters({
                discount: false,
                featured: false,
                bestseller: false,
              });
              setCategoryName(t("all_products"));
            },
            featured: () => {
              setFilters({
                discount: false,
                featured: true,
                bestseller: false,
              });
              setCategoryName(t("footer_featured"));
            },
            discounted: () => {
              setFilters({
                discount: true,
                featured: false,
                bestseller: false,
              });
              setCategoryName(t("footer_discounted"));
            },
            bestseller: () => {
              setFilters({
                discount: false,
                featured: false,
                bestseller: true,
              });
              setCategoryName(t("footer_bestseller"));
            },
          };

          map[id as keyof typeof map]?.();
          const allFoods = await fetchAll();
          setFoods(allFoods);
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/${id}/foods-tree`,
          { signal: controller.signal },
        );
        const json = await res.json();

        setFoods(json?.foods ?? []);
        setCategoryName(json?.category?.categoryName ?? t("category"));
      } catch {
        setFoods([]);
        setCategoryName(t("category"));
      } finally {
        setIsLoading(false);
      }
    }

    run();
    return () => controller.abort();
  }, [id, t]);

  useEffect(() => {
    setPage(1);
  }, [id, sortType, filters]);

  // ✅ FILTERING
  const filteredFoods = useMemo(() => {
    return foods.filter((f) => {
      if (filters.discount && !isDiscounted(f)) return false;
      if (filters.featured && !isFeatured(f)) return false;
      if (filters.bestseller && !isBestseller(f)) return false;
      return true;
    });
  }, [foods, filters]);

  // ✅ SORTING
  const sortedFoods = useMemo(() => {
    return [...filteredFoods].sort((a: any, b: any) => {
      if (sortType === "low") return (a.price ?? 0) - (b.price ?? 0);
      if (sortType === "high") return (b.price ?? 0) - (a.price ?? 0);

      const da = new Date(a.createdAt || 0).getTime();
      const db = new Date(b.createdAt || 0).getTime();
      return sortType === "oldest" ? da - db : db - da;
    });
  }, [filteredFoods, sortType]);

  const totalPages = Math.max(1, Math.ceil(sortedFoods.length / PER_PAGE));
  const pagedFoods = sortedFoods.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return {
    foods,
    filteredFoods,
    pagedFoods,
    page,
    totalPages,
    filters,
    categoryName,
    setPage,
    setSortType,
    toggleFilter,
    isLoading,
  };
}
