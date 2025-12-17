/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { use, useEffect, useMemo, useState } from "react";
import { FoodCard } from "@/components/FoodCard";
import { CategorySidebar } from "@/components/category/CategorySidebar";
import { CategoryHeader } from "@/components/category/CategoryHeader";
import { FoodType } from "@/type/type";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

/**
 * CategoryPage (client)
 * - Next 16 passes params as a Promise for dynamic routes -> unwrap with React.use()
 * - Handles "all", "featured", "discounted", "bestseller" as special ids
 * - Filters are controlled here and passed down to the sidebar
 */
export default function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { t } = useI18n();

  // unwrap params (NEXT 16/Turbopack)
  const { id } = use(params);

  const [foods, setFoods] = useState<FoodType[]>([]);
  const [categoryName, setCategoryName] = useState<string>(t("category"));
  const [page, setPage] = useState(1);
  const [sortType, setSortType] = useState<
    "newest" | "oldest" | "low" | "high"
  >("newest");
  const perPage = 8;

  type Filters = {
    discount: boolean;
    featured: boolean;
    bestseller: boolean;
  };

  // filters controlled at page level
  const [filters, setFilters] = useState<Filters>({
    discount: false,
    featured: false,
    bestseller: false,
  });

  // helper for toggling filters (type-safe)
  const handleFilterToggle = (k: keyof Filters) =>
    setFilters((prev) => ({ ...prev, [k]: !prev[k] }));

  // helper that checks multiple possible flag names on a product
  function hasFlag(item: any, names: string[]) {
    for (const n of names) {
      if (n in item) {
        const v = item[n];
        if (typeof v === "boolean") return v;
        if (typeof v === "number") return v > 0;
        if (typeof v === "string") return v === "true" || v === "1";
      }
    }
    return false;
  }

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchAllProducts = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/food`, {
        signal,
      });
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    };

    const fetchCategoryTreeFoods = async (categoryId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/${categoryId}/foods-tree`,
        { signal }
      );
      const json = await res.json();
      return json;
    };

    const run = async () => {
      try {
        // special-case: all products
        if (id === "all") {
          const data = await fetchAllProducts();
          setFoods(data);
          setCategoryName(t("all_products"));
          return;
        }

        // special-case pseudo-categories that are filters, not real category IDs
        if (["featured", "discounted", "bestseller"].includes(id)) {
          const data: any[] = await fetchAllProducts();

          // set foods to all products (page-level filters will apply)
          setFoods(data);

          // set friendly title
          const titleMap: Record<string, string> = {
            featured: t("footer_featured") ?? "Featured",
            discounted: t("footer_discounted") ?? "Discounted",
            bestseller: t("footer_bestseller") ?? "Bestseller",
          };
          setCategoryName(titleMap[id] ?? t("category"));
          return;
        }

        // normal category -> ask backend for foods-tree
        const json = await fetchCategoryTreeFoods(id);

        if (!json?.success) {
          console.error("Category foods-tree error:", json);
          setFoods([]);
          setCategoryName(t("category"));
          return;
        }

        const { category, foods: categoryFoods } = json;
        setFoods(Array.isArray(categoryFoods) ? categoryFoods : []);
        if (category?.categoryName) setCategoryName(category.categoryName);
        else setCategoryName(t("category"));
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error("Failed to load category:", err);
        setFoods([]);
        setCategoryName(t("category"));
      }
    };

    run();
    return () => controller.abort();
  }, [id, t]);

  // reset page on changes
  useEffect(() => {
    setPage(1);
  }, [id, sortType, filters]);

  // apply page-level filters (client-side)
  const filteredFoods = useMemo(() => {
    let arr = [...foods];

    const { discount, featured, bestseller } = filters;

    if (discount || featured || bestseller) {
      arr = arr.filter((f: any) => {
        let ok = true;
        if (discount) {
          ok =
            ok &&
            hasFlag(f, ["discount", "isDiscount", "onDiscount", "hasDiscount"]);
        }
        if (featured) {
          ok = ok && hasFlag(f, ["featured", "isFeatured"]);
        }
        if (bestseller) {
          ok = ok && hasFlag(f, ["bestseller", "isBestseller"]);
        }
        return ok;
      });
    }

    return arr;
  }, [foods, filters]);

  // sorting
  const sortedFoods = useMemo(() => {
    const arr = [...filteredFoods];
    return arr.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      switch (sortType) {
        case "newest":
          return dateB - dateA;
        case "oldest":
          return dateA - dateB;
        case "low":
          return (a.price ?? 0) - (b.price ?? 0);
        case "high":
          return (b.price ?? 0) - (a.price ?? 0);
        default:
          return 0;
      }
    });
  }, [filteredFoods, sortType]);

  const totalPages = Math.max(1, Math.ceil(sortedFoods.length / perPage));
  const pagedFoods = sortedFoods.slice((page - 1) * perPage, page * perPage);

  return (
    <main className="min-h-screen w-full bg-[#0a0a0a] text-white pt-[90px] px-6 md:px-12 flex flex-col md:flex-row gap-8">
      <div className="md:w-[250px] w-full">
        <CategorySidebar
          filters={filters}
          onFilterToggle={handleFilterToggle}
        />
      </div>

      <div className="flex-1">
        <CategoryHeader
          title={categoryName}
          count={filteredFoods.length}
          onSortChange={(val) =>
            setSortType(val as "newest" | "oldest" | "low" | "high")
          }
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 mt-6">
          {pagedFoods.length > 0 ? (
            pagedFoods.map((item) => <FoodCard key={item.id} food={item} />)
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
              <span className="text-5xl mb-4">📦</span>
              <p className="text-sm md:text-base">{t("empty")}</p>
            </div>
          )}
        </div>

        {sortedFoods.length > perPage && (
          <div className="flex justify-center items-center mt-10 gap-4 text-gray-400">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="px-2 py-1 hover:text-[#facc15] disabled:opacity-30"
            >
              {t("first")}
            </button>

            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2 py-1 hover:text-[#facc15] disabled:opacity-30"
            >
              {t("prev")}
            </button>

            <span className="font-medium text-[#facc15]">
              {page} / {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-2 py-1 hover:text-[#facc15] disabled:opacity-30"
            >
              {t("next")}
            </button>

            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="px-2 py-1 hover:text-[#facc15] disabled:opacity-30"
            >
              {t("last")}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
