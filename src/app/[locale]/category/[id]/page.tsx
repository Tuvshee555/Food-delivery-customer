/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { use, useEffect, useMemo, useState } from "react";
import { FoodCard } from "@/components/FoodCard";
import { CategorySidebar } from "@/components/category/CategorySidebar";
import { CategoryHeader } from "@/components/category/CategoryHeader";
import { FoodType } from "@/type/type";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { t } = useI18n();
  const { id } = use(params);

  const [foods, setFoods] = useState<FoodType[]>([]);
  const [categoryName, setCategoryName] = useState(t("category"));
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

  const [filters, setFilters] = useState<Filters>({
    discount: false,
    featured: false,
    bestseller: false,
  });

  const handleFilterToggle = (k: keyof Filters) =>
    setFilters((prev) => ({ ...prev, [k]: !prev[k] }));

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

    const fetchAll = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/food`, {
        signal: controller.signal,
      });
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    };

    const fetchCategoryFoods = async (categoryId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/${categoryId}/foods-tree`,
        { signal: controller.signal }
      );
      return await res.json();
    };

    const run = async () => {
      try {
        if (id === "all") {
          setFilters({ discount: false, featured: false, bestseller: false });
          setFoods(await fetchAll());
          setCategoryName(t("all_products"));
          return;
        }

        if (id === "featured") {
          setFilters({ discount: false, featured: true, bestseller: false });
          setFoods(await fetchAll());
          setCategoryName(t("footer_featured"));
          return;
        }

        if (id === "discounted") {
          setFilters({ discount: true, featured: false, bestseller: false });
          setFoods(await fetchAll());
          setCategoryName(t("footer_discounted"));
          return;
        }

        if (id === "bestseller") {
          setFilters({ discount: false, featured: false, bestseller: true });
          setFoods(await fetchAll());
          setCategoryName(t("footer_bestseller"));
          return;
        }

        const json = await fetchCategoryFoods(id);
        if (!json?.success) {
          setFoods([]);
          setCategoryName(t("category"));
          return;
        }

        setFoods(json.foods ?? []);
        setCategoryName(json.category?.categoryName ?? t("category"));
      } catch {
        setFoods([]);
        setCategoryName(t("category"));
      }
    };

    run();
    return () => controller.abort();
  }, [id, t]);

  useEffect(() => setPage(1), [id, sortType, filters]);

  const filteredFoods = useMemo(() => {
    let arr = [...foods];
    const { discount, featured, bestseller } = filters;

    if (discount || featured || bestseller) {
      arr = arr.filter((f: any) => {
        let ok = true;
        if (discount) ok = ok && hasFlag(f, ["discount", "isDiscount"]);
        if (featured) ok = ok && hasFlag(f, ["featured", "isFeatured"]);
        if (bestseller) ok = ok && hasFlag(f, ["bestseller", "isBestseller"]);
        return ok;
      });
    }
    return arr;
  }, [foods, filters]);

  const sortedFoods = useMemo(() => {
    return [...filteredFoods].sort((a: any, b: any) => {
      const da = new Date(a.createdAt || 0).getTime();
      const db = new Date(b.createdAt || 0).getTime();
      if (sortType === "newest") return db - da;
      if (sortType === "oldest") return da - db;
      if (sortType === "low") return (a.price ?? 0) - (b.price ?? 0);
      if (sortType === "high") return (b.price ?? 0) - (a.price ?? 0);
      return 0;
    });
  }, [filteredFoods, sortType]);

  const totalPages = Math.max(1, Math.ceil(sortedFoods.length / perPage));
  const pagedFoods = sortedFoods.slice((page - 1) * perPage, page * perPage);

  return (
    <main className="min-h-screen w-full bg-background text-foreground px-4 sm:px-6 md:px-10 py-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* SIDEBAR */}
        <div className="w-full md:w-[260px] shrink-0">
          <CategorySidebar
            filters={filters}
            onFilterToggle={handleFilterToggle}
          />
        </div>

        {/* CONTENT */}
        <div className="flex-1">
          <CategoryHeader
            title={categoryName}
            count={filteredFoods.length}
            onSortChange={(v) =>
              setSortType(v as "newest" | "oldest" | "low" | "high")
            }
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {pagedFoods.length > 0 ? (
              pagedFoods.map((item) => <FoodCard key={item.id} food={item} />)
            ) : (
              <div className="col-span-full flex flex-col items-center py-20 text-muted-foreground">
                <span className="text-5xl mb-4">📦</span>
                <p className="text-sm">{t("empty")}</p>
              </div>
            )}
          </div>

          {sortedFoods.length > perPage && (
            <div className="flex justify-center items-center mt-10 gap-4 text-muted-foreground text-sm">
              <button onClick={() => setPage(1)} disabled={page === 1}>
                {t("first")}
              </button>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                {t("prev")}
              </button>
              <span className="font-medium text-primary">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                {t("next")}
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
              >
                {t("last")}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
