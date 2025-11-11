"use client";

import { use, useEffect, useState, useMemo } from "react";
import { FoodCard } from "@/components/FoodCard";
import { Header } from "@/components/Header";
import { CategorySidebar } from "@/components/category/CategorySidebar";
import { CategoryHeader } from "@/components/category/CategoryHeader";
import { FoodType } from "@/type/type";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [foods, setFoods] = useState<FoodType[]>([]);
  const [categoryName, setCategoryName] = useState<string>("Ангилал");
  const [page, setPage] = useState(1);
  const [sortType, setSortType] = useState("newest");
  const perPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/food`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const filtered = data.filter(
            (f) =>
              f.category === id || f.categoryId === id || f.category?._id === id
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
  }, [id]);

  // 🔄 Sort foods dynamically based on sortType
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

  // Pagination logic
  const totalPages = Math.ceil(sortedFoods.length / perPage);
  const pagedFoods = sortedFoods.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <Header compact />

      <main className="min-h-screen w-full bg-[#0a0a0a] text-white pt-[90px] px-6 md:px-12 flex flex-col md:flex-row gap-8">
        {/* Left Sidebar */}
        <div className="md:w-[250px] w-full">
          <CategorySidebar />
        </div>

        {/* Right Main Content */}
        <div className="flex-1">
          <CategoryHeader
            title={categoryName}
            count={foods.length}
            onSortChange={setSortType}
          />

          {/* Food Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 mt-6">
            {pagedFoods.map((item) => (
              <FoodCard key={item._id || item.id} food={item} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-10 gap-4 text-gray-400">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className={`px-2 py-1 ${
                  page === 1
                    ? "opacity-30 cursor-default"
                    : "hover:text-[#facc15]"
                }`}
              >
                ⏮
              </button>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`px-2 py-1 ${
                  page === 1
                    ? "opacity-30 cursor-default"
                    : "hover:text-[#facc15]"
                }`}
              >
                ◀
              </button>
              <span className="font-medium text-[#facc15]">{page}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`px-2 py-1 ${
                  page === totalPages
                    ? "opacity-30 cursor-default"
                    : "hover:text-[#facc15]"
                }`}
              >
                ▶
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className={`px-2 py-1 ${
                  page === totalPages
                    ? "opacity-30 cursor-default"
                    : "hover:text-[#facc15]"
                }`}
              >
                ⏭
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
