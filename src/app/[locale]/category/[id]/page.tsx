/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useMemo, use } from "react";
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
  const { id } = use(params); // unwrap route params (app router async)

  const [foods, setFoods] = useState<FoodType[]>([]);
  const [categoryName, setCategoryName] = useState<string>(t("category"));
  const [page, setPage] = useState(1);
  const [sortType, setSortType] = useState<
    "newest" | "oldest" | "low" | "high"
  >("newest");
  const perPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ALL products
        if (id === "all") {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/food`
          );
          const data = await res.json();
          if (!Array.isArray(data)) return;

          setFoods(data);
          setCategoryName(t("all_products"));
          return;
        }

        // Category + its children foods from backend
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/${id}/foods-tree`
        );
        const json = await res.json();

        if (!json?.success) {
          console.error("Category foods-tree error:", json);
          setFoods([]);
          setCategoryName(t("category"));
          return;
        }

        const { category, foods: categoryFoods } = json;
        setFoods(Array.isArray(categoryFoods) ? categoryFoods : []);
        if (category?.categoryName) {
          setCategoryName(category.categoryName);
        } else {
          setCategoryName(t("category"));
        }
      } catch (err) {
        console.error("Failed to load category:", err);
        setFoods([]);
        setCategoryName(t("category"));
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    setPage(1);
  }, [id, sortType]);

  const sortedFoods = useMemo(() => {
    const arr = [...foods];

    return arr.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();

      switch (sortType) {
        case "newest":
          return dateB - dateA;
        case "oldest":
          return dateA - dateB;
        case "low":
          return a.price - b.price;
        case "high":
          return b.price - a.price;
        default:
          return 0;
      }
    });
  }, [foods, sortType]);

  const totalPages = Math.ceil(sortedFoods.length / perPage) || 1;
  const pagedFoods = sortedFoods.slice((page - 1) * perPage, page * perPage);

  return (
    <main className="min-h-screen w-full bg-[#0a0a0a] text-white pt-[90px] px-6 md:px-12 flex flex-col md:flex-row gap-8">
      {/* Left: Sidebar */}
      <div className="md:w-[250px] w-full">
        <CategorySidebar />
      </div>

      {/* Right: Products */}
      <div className="flex-1">
        <CategoryHeader
          title={categoryName}
          count={foods.length}
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

        {/* Pagination */}
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
