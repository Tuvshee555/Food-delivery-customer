"use client";

import { use } from "react";
import { FoodCard } from "@/components/FoodCard";
import { CategorySidebar } from "@/components/category/CategorySidebar";
import { CategoryHeader } from "@/components/category/CategoryHeader";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { useCategoryLogic } from "@/components/category/components/useCategoryFoods";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { t } = useI18n();
  const { id } = use(params);

  const {
    pagedFoods,
    filteredFoods,
    foods,
    page,
    totalPages,
    filters,
    categoryName,
    setPage,
    setSortType,
    toggleFilter,
  } = useCategoryLogic(id);

  return (
    <main className="min-h-screen w-full bg-background text-foreground px-4 sm:px-6 md:px-10 py-6">
      {/* MOBILE ACTIONS */}
      <div className="md:hidden sticky top-0 z-20 bg-background border-b border-border">
        <div className="flex gap-3 px-4 py-3">
          <button className="flex-1 h-[44px] rounded-md border border-border bg-card text-sm font-medium">
            {t("filter")}
          </button>
          <button className="flex-1 h-[44px] rounded-md border border-border bg-card text-sm font-medium">
            {t("sort")}
          </button>
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
              onSortChange={(v) =>
                setSortType(v as "newest" | "oldest" | "low" | "high")
              }
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {pagedFoods.length ? (
              pagedFoods.map((item) => <FoodCard key={item.id} food={item} />)
            ) : (
              <div className="col-span-full flex flex-col items-center py-20 text-muted-foreground">
                <span className="text-5xl mb-4">📦</span>
                <p className="text-sm">{t("empty")}</p>
              </div>
            )}
          </div>

          {foods.length > 8 && (
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
