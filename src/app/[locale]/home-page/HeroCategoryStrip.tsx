/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useCategory } from "@/hooks/useCategory";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import type { FoodType, Datas } from "@/type/type";
import { useFood } from "@/hooks/useFood";

export const HeroCategoryStrip = () => {
  const { locale } = useI18n();
  const pathname = usePathname();

  // ✅ React Query hooks
  const { data: categories } = useCategory();
  const { data: foods } = useFood();

  // normalize (NO implicit any)
  const safeCategories: Datas[] = categories ?? [];
  const safeFoods: FoodType[] = foods ?? [];

  const scrollRef = useRef<HTMLDivElement>(null);

  const activeId = pathname?.split("/category/")[1];

  /**
   * Build preview image map
   * NOTE: we intentionally only accept string URLs here
   * to avoid object URL memory leaks
   */
  const previewImages = useMemo(() => {
    const map = new Map<string, string>();

    for (const cat of safeCategories) {
      const food = safeFoods.find(
        (item) => item.category === cat.id || item.categoryId === cat.id
      );

      if (food && typeof food.image === "string") {
        map.set(cat.id, food.image);
      }
    }

    return map;
  }, [safeCategories, safeFoods]);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <section className="sticky top-[64px] z-30 bg-background border-t border-border">
      <div className="relative max-w-7xl mx-auto px-4 py-4">
        {/* DESKTOP ARROWS */}
        <button
          onClick={() => scroll("left")}
          className="
            hidden md:flex
            absolute left-2 top-1/2 -translate-y-1/2
            z-10
            h-9 w-9
            items-center justify-center
            rounded-full
            bg-background border border-border
            shadow-sm
          "
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={() => scroll("right")}
          className="
            hidden md:flex
            absolute right-2 top-1/2 -translate-y-1/2
            z-10
            h-9 w-9
            items-center justify-center
            rounded-full
            bg-background border border-border
            shadow-sm
          "
        >
          <ChevronRight size={18} />
        </button>

        {/* EDGE FADE */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-background to-transparent z-10" />

        {/* SCROLL AREA */}
        <div className="mx-auto max-w-[980px]">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto no-scrollbar"
          >
            {safeCategories
              .filter((c) => c.parentId === null)
              .map((cat) => {
                const isActive = activeId === cat.id;

                return (
                  <Link
                    key={cat.id}
                    href={`/${locale}/category/${cat.id}`}
                    className={`
                      shrink-0
                      rounded-xl
                      overflow-hidden
                      border
                      transition
                      ${
                        isActive
                          ? "border-foreground"
                          : "border-border hover:border-foreground/40"
                      }
                    `}
                  >
                    <div
                      className="
                        w-[40vw]
                        max-w-[240px]
                        sm:w-[220px]
                        md:w-[180px]
                        lg:w-[160px]
                        h-[84px]
                        sm:h-[96px]
                        relative
                      "
                    >
                      <img
                        src={previewImages.get(cat.id) ?? "/BackMain.png"}
                        alt={cat.categoryName}
                        className="absolute inset-0 w-full h-full object-cover"
                      />

                      <div
                        className={`absolute inset-0 ${
                          isActive ? "bg-black/15" : "bg-black/25"
                        }`}
                      />

                      <div className="absolute inset-0 flex items-center justify-center px-3">
                        <span
                          className={`text-sm font-medium text-center ${
                            isActive ? "text-white" : "text-white/90"
                          }`}
                        >
                          {cat.categoryName}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCategoryStrip;
