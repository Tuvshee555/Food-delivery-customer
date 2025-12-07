/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useCategory } from "@/app/[locale]/provider/CategoryProvider";
import { useFood } from "@/app/[locale]/provider/FoodDataProvider";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

export const HeroCategoryStrip = () => {
  const { category } = useCategory();
  const { foodData } = useFood();
  const { locale } = useI18n();

  const getPreviewImage = (catId: string) => {
    const f = foodData.find(
      (item) => item.category === catId || item.categoryId === catId
    );
    const img = f?.image;
    return img
      ? typeof img === "string"
        ? img
        : URL.createObjectURL(img)
      : "/BackMain.png";
  };

  return (
    <div className="w-full bg-white py-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 flex gap-10 justify-center overflow-x-auto no-scrollbar">
        {category
          .filter((c) => c.parentId === null)
          .map((cat) => (
            <Link
              key={cat.id}
              href={`/${locale}/category/${cat.id}`}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-[70px] h-[70px] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group-hover:shadow-md transition">
                <img
                  src={getPreviewImage(cat.id)}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                  alt={cat.categoryName}
                />
              </div>

              <span className="text-xs font-semibold text-gray-800 text-center group-hover:text-black transition">
                {cat.categoryName}
              </span>
            </Link>
          ))}
      </div>
    </div>
  );
};
