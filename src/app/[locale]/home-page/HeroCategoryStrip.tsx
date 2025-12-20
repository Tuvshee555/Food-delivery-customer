/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCategory } from "@/app/[locale]/provider/CategoryProvider";
import { useFood } from "@/app/[locale]/provider/FoodDataProvider";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

export const HeroCategoryStrip = () => {
  const { category } = useCategory();
  const { foodData } = useFood();
  const { locale } = useI18n();

  const previewImages = useMemo(() => {
    const map = new Map<string, string>();

    category.forEach((cat) => {
      const f = foodData.find(
        (item) => item.category === cat.id || item.categoryId === cat.id
      );

      if (f?.image) {
        map.set(
          cat.id,
          typeof f.image === "string" ? f.image : URL.createObjectURL(f.image)
        );
      }
    });

    return map;
  }, [category, foodData]);

  return (
    <section className="w-full bg-background border-t border-border py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          {category
            .filter((c) => c.parentId === null)
            .map((cat) => (
              <Link
                key={cat.id}
                href={`/${locale}/category/${cat.id}`}
                className="
                  group
                  relative
                  min-w-[220px]
                  h-[140px]
                  rounded-2xl
                  overflow-hidden
                  bg-card
                  border border-border
                  shrink-0
                "
              >
                {/* IMAGE */}
                <img
                  src={previewImages.get(cat.id) ?? "/BackMain.png"}
                  alt={cat.categoryName}
                  className="
                    absolute inset-0
                    w-full h-full
                    object-cover
                    transition-transform duration-500
                    group-hover:scale-105
                  "
                />

                {/* OVERLAY */}
                <div
                  className="
                    absolute inset-0
                    bg-gradient-to-t
                    from-black/70
                    via-black/30
                    to-transparent
                  "
                />

                {/* TEXT */}
                <div className="absolute bottom-4 left-4 right-4">
                  <span
                    className="
                      text-white
                      text-sm
                      font-semibold
                      tracking-wide
                    "
                  >
                    {cat.categoryName}
                  </span>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
};
