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
  const { id } = use(params); // ✅ unwrap params properly

  const [foods, setFoods] = useState<FoodType[]>([]);
  const [categoryName, setCategoryName] = useState<string>(t("category"));
  const [page, setPage] = useState(1);
  const [sortType, setSortType] = useState("newest");
  const perPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/food`);
        const data = await res.json();

        if (!Array.isArray(data)) return;

        if (id === "all") {
          setFoods(data);
          setCategoryName(t("all_products"));
        } else {
          const filtered = data.filter(
            (f) =>
              f.category === id || f.categoryId === id || f.category?.id === id
          );

          setFoods(filtered);

          if (filtered.length > 0) {
            const cat = filtered[0].categoryName || filtered[0].category?.name;
            if (cat) setCategoryName(cat);
          }
        }
      } catch (err) {
        console.error("Failed to load category:", err);
      }
    };

    fetchData();
  }, [id]); // 👈 ONLY "id" here

  const sortedFoods = useMemo(() => {
    const arr = [...foods];
    switch (sortType) {
      case "newest":
        return arr.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );
      case "oldest":
        return arr.sort(
          (a, b) =>
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime()
        );
      case "low":
        return arr.sort((a, b) => a.price - b.price);
      case "high":
        return arr.sort((a, b) => b.price - a.price);
      default:
        return arr;
    }
  }, [foods, sortType]);

  const totalPages = Math.ceil(sortedFoods.length / perPage);
  const pagedFoods = sortedFoods.slice((page - 1) * perPage, page * perPage);

  return (
    <main className="min-h-screen w-full bg-[#0a0a0a] text-white pt-[90px] px-6 md:px-12 flex flex-col md:flex-row gap-8">
      <div className="md:w-[250px] w-full">
        <CategorySidebar />
      </div>

      <div className="flex-1">
        <CategoryHeader
          title={categoryName}
          count={foods.length}
          onSortChange={setSortType}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 mt-6">
          {pagedFoods.map((item) => (
            <FoodCard key={item.id} food={item} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-10 gap-4 text-gray-400">
            {/* Pagination Buttons */}
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

            <span className="font-medium text-[#facc15]">{page}</span>

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
