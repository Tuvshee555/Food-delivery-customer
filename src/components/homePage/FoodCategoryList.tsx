/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useCategory } from "@/app/[locale]/provider/CategoryProvider";
import { useFood } from "@/app/[locale]/provider/FoodDataProvider";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { FoodCard } from "../FoodCard";

export const FoodCategoryList = () => {
  const { category } = useCategory();
  const { foodData } = useFood();
  const { locale, t } = useI18n();

  const getMediaUrl = (media?: string | File): string => {
    if (!media) return "/placeholder.png";
    return typeof media === "string" ? media : URL.createObjectURL(media);
  };

  return (
    <div className="w-full flex flex-col gap-16 mt-10 px-6 md:px-10">
      {category.map((cat) => {
        const catId = cat.id;

        const filteredFood = foodData.filter(
          (dish) => dish.category === catId || dish.categoryId === catId
        );

        const firstFoodImage =
          filteredFood.length > 0
            ? getMediaUrl(filteredFood[0].image)
            : "/order.png";

        return (
          <section key={catId} className="w-full">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <img
                  src={firstFoodImage}
                  alt={`${cat.categoryName}`}
                  className="w-[32px] h-[32px] rounded-md object-cover border border-gray-700"
                />
                <h2 className="text-lg md:text-xl font-semibold text-white">
                  {cat.categoryName || t("unknown_category")}
                </h2>
              </div>

              <Link
                href={`/${locale}/category/${catId}`}
                className="flex items-center gap-1 text-gray-400 text-sm hover:text-[#facc15] transition"
              >
                {t("see_more")}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Grid: 5 columns on large screens */}
            {filteredFood.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filteredFood.map((dish) => (
                  // wrap so we can control width/height consistently
                  <div key={dish.id} className="w-full">
                    <FoodCard food={dish} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">
                {t("no_products_in_category")}
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
};
