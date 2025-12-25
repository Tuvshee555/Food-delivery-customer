/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { useCategory } from "@/hooks/useCategory";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { FoodCard } from "../FoodCard";
import { useFood } from "@/hooks/useFood";

export const FoodCategoryList = () => {
  const { locale, t } = useI18n();

  // ✅ React Query hooks
  const { data: categories = [], isLoading: categoryLoading } = useCategory();
  const { data: foods = [], isLoading: foodLoading } = useFood();

  const isLoading = categoryLoading || foodLoading;

  const getMediaUrl = (media?: string | File): string => {
    if (!media) return "/placeholder.png";
    return typeof media === "string" ? media : URL.createObjectURL(media);
  };

  // ⏳ Loading state
  if (isLoading) {
    return (
      <section className="w-full px-4 mt-10">
        <p className="text-sm text-muted-foreground">{t("loading")}...</p>
      </section>
    );
  }

  return (
    <section className="w-full">
      <div className="max-full px-[16px] mx-auto flex flex-col gap-16 mt-10">
        {categories
          .filter((cat) => cat.parentId === null)
          .map((cat) => {
            const catId = cat.id;

            const filteredFood = foods.filter(
              (dish) => dish.category === catId || dish.categoryId === catId
            );

            const firstFoodImage =
              filteredFood.length > 0
                ? getMediaUrl(filteredFood[0].image)
                : "/order.png";

            return (
              <section key={catId} className="w-full">
                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={firstFoodImage}
                      alt={cat.categoryName}
                      className="w-[32px] h-[32px] rounded-md object-cover border border-border"
                    />
                    <h2 className="text-lg md:text-xl font-semibold text-foreground truncate">
                      {cat.categoryName || t("unknown_category")}
                    </h2>
                  </div>

                  <Link
                    href={`/${locale}/category/${catId}`}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition"
                  >
                    {t("see_more")}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* GRID */}
                {filteredFood.length > 0 ? (
                  <div
                    className="
                      grid
                      grid-cols-2
                      sm:grid-cols-3
                      md:grid-cols-4
                      lg:grid-cols-5
                      gap-6
                    "
                  >
                    {filteredFood.map((dish) => (
                      <FoodCard key={dish.id} food={dish} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm italic text-muted-foreground">
                    {t("no_products_in_category")}
                  </p>
                )}
              </section>
            );
          })}
      </div>
    </section>
  );
};

export default FoodCategoryList;
