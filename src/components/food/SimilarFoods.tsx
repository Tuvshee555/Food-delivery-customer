"use client";

import Link from "next/link";
import { FoodType } from "@/type/type";
import { FoodCard } from "@/components/FoodCard";
import React from "react";

/**
 * Normalize whatever id-like value you get into a comparable string.
 * Accepts string | number | { _id?: string } | { id?: string } | null | undefined
 */
const normalizeId = (v: any): string | null => {
  if (v == null) return null;
  if (typeof v === "string" || typeof v === "number") return String(v);
  // handle objects that contain id-like fields
  if (typeof v === "object") {
    if ("_id" in v && v.id) return String(v.id);
    if ("id" in v && v.id) return String(v.id);
    if ("categoryId" in v && v.categoryId) return String(v.categoryId);
    // fallback: try JSON
    try {
      return JSON.stringify(v);
    } catch {
      return null;
    }
  }
  return null;
};

export const SimilarFoods = ({
  food,
  allFoods,
}: {
  food: FoodType;
  allFoods: FoodType[];
}) => {
  // normalize current food category id and own id
  const currentCategory = normalizeId(
    (food as any).categoryId ??
      (food as any).category ??
      (food as any).category?.id
  );
  const currentFoodId = normalizeId(
    (food as any).id ?? (food as any).id ?? food
  );

  // Debug (remove if you don't want logs)
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.debug(
      "[SimilarFoods] currentCategory:",
      currentCategory,
      "currentFoodId:",
      currentFoodId
    );
    // eslint-disable-next-line no-console
    console.debug("[SimilarFoods] allFoods sample:", allFoods?.slice(0, 6));
  }

  const similar = (allFoods || []).filter((item) => {
    const itemId = normalizeId((item as any).id ?? (item as any).id ?? item);
    const itemCategory =
      normalizeId(
        (item as any).categoryId ??
          (item as any).category ??
          (item as any).category?.id
      ) || normalizeId((item as any).category);

    // exclude same item
    if (itemId && currentFoodId && itemId === currentFoodId) return false;

    // match category (both normalized)
    if (currentCategory && itemCategory && currentCategory === itemCategory)
      return true;

    return false;
  });

  // If nothing matched, try a looser match: compare category name if available
  if (similar.length === 0) {
    const catName = (food as any).categoryName || (food as any).category?.name;
    if (catName) {
      const fallback = (allFoods || []).filter((item) => {
        const itemCatName =
          (item as any).categoryName || (item as any).category?.name;
        return (
          itemCatName &&
          itemCatName === catName &&
          normalizeId((item as any).id) !== currentFoodId
        );
      });
      if (fallback.length > 0) {
        // eslint-disable-next-line no-console
        console.debug(
          "[SimilarFoods] fallback by categoryName matched:",
          fallback.length
        );
        return (
          <section className="max-w-7xl mx-auto mt-20 px-6 md:px-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-white">
                Төстэй бүтээгдэхүүн
              </h2>
              <Link
                href={`/category/${
                  food.categoryId ?? food.category ?? (food as any).id
                }`}
                className="flex items-center gap-1 text-gray-400 text-sm hover:text-[#facc15] transition"
              >
                Цааш үзэх →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {fallback.map((item) => (
                <FoodCard
                  key={
                    normalizeId((item as any).id ?? (item as any).id) ||
                    Math.random()
                  }
                  food={item}
                />
              ))}
            </div>
          </section>
        );
      }
    }
  }

  if (similar.length === 0) {
    return (
      <section className="max-w-7xl mx-auto mt-20 px-6 md:px-10">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-400 text-center">
          😅 Төстэй бүтээгдэхүүн олдсонгүй
        </h2>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto mt-20 px-6 md:px-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-white">
          Төстэй бүтээгдэхүүн
        </h2>

        <Link
          href={`/category/${
            (food as any).categoryId ??
            (food as any).category ??
            (food as any).id
          }`}
          className="flex items-center gap-1 text-gray-400 text-sm hover:text-[#facc15] transition"
        >
          Цааш үзэх →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {similar.map((item) => (
          <FoodCard
            key={
              normalizeId((item as any).id ?? (item as any).id) || Math.random()
            }
            food={item}
          />
        ))}
      </div>
    </section>
  );
};

export default SimilarFoods;
