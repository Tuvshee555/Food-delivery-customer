/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { use, useMemo, useState } from "react";
import { FoodCard } from "@/components/FoodCard";
import { CategorySidebar } from "@/components/category/CategorySidebar";
import { CategoryHeader } from "@/components/category/CategoryHeader";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { useCategoryLogic } from "@/components/category/components/useCategoryFoods";
import { CategoryFilterSheet } from "@/components/category/components/CategoryFilterSheet";
import { CategorySortDrawer } from "@/components/category/components/CategorySortDrawer";
import { FoodCardSkeleton } from "@/components/skeletons/FoodCardSkeleton";

const PAGE_SIZE = 48;

export default function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { t } = useI18n();
  const { id } = use(params);

  const {
    filteredFoods,
    foods,
    filters,
    categoryName,
    setSortType,
    toggleFilter,
    isLoading,
  } = useCategoryLogic(id);

  const [page, setPage] = useState(1);
  const [mobileSort, setMobileSort] = useState<
    "newest" | "oldest" | "low" | "high" | "discounted"
  >("newest");

  const totalPages = Math.ceil(filteredFoods.length / PAGE_SIZE);

  const pagedFoods = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredFoods.slice(start, start + PAGE_SIZE);
  }, [filteredFoods, page]);

  return (
    <main className="min-h-screen w-full bg-background text-foreground px-4 sm:px-6 md:px-10 py-6">
      {/* MOBILE ACTIONS */}
      <div className="md:hidden sticky top-0 z-20 bg-background border-b border-border">
        <div className="flex gap-3 px-4 py-3">
          <CategoryFilterSheet
            filters={filters}
            onFilterToggle={toggleFilter}
          />
          <CategorySortDrawer
            value={mobileSort}
            onChange={(v) => {
              setMobileSort(v);
              setSortType(v as any);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* SIDEBAR */}
        <div className="hidden md:block w-[260px] shrink-0">
          <CategorySidebar filters={filters} onFilterToggle={toggleFilter} />
        </div>

        {/* CONTENT */}
        <div className="flex-1">
          <div className="hidden md:block">
            <CategoryHeader
              title={categoryName}
              count={filteredFoods.length}
              onSortChange={(v) => {
                setSortType(v as any);
                setPage(1);
              }}
            />
          </div>

          {/* GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <FoodCardSkeleton key={i} />
                ))
              : pagedFoods.map((item) => (
                  <FoodCard key={item.id} food={item} />
                ))}
          </div>

          {/* PAGINATION */}
          {!isLoading && filteredFoods.length > 0 && (
            <div className="flex justify-center items-center gap-2 mt-12 text-sm">
              <button
                className="px-3 py-2 rounded border border-border disabled:opacity-40"
                onClick={() => setPage(1)}
                disabled={page === 1}
              >
                «
              </button>

              <button
                className="px-3 py-2 rounded border border-border disabled:opacity-40"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ‹
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                const isActive = p === page;

                // limit visible buttons
                if (p !== 1 && p !== totalPages && Math.abs(p - page) > 1) {
                  if (p === 2 || p === totalPages - 1) {
                    return (
                      <span key={p} className="px-2 text-muted-foreground">
                        …
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-2 rounded border ${
                      isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                className="px-3 py-2 rounded border border-border disabled:opacity-40"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                ›
              </button>

              <button
                className="px-3 py-2 rounded border border-border disabled:opacity-40"
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
              >
                »
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
