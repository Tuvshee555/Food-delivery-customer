/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { FoodCard } from "../FoodCard";
import {
  TabKey,
  useAutoScrollProducts,
} from "./components/useAutoScrollProducts";
import { useFood } from "@/hooks/useFood";

export const AutoScrollProducts = () => {
  const { locale, t } = useI18n();

  // ✅ React Query (replaces FoodDataProvider)
  const { data: foods = [], isLoading } = useFood();

  const tabs: { key: TabKey; label: string }[] = [
    { key: "featured", label: t("featured") },
    { key: "new", label: t("new") },
    { key: "bestseller", label: t("bestseller") },
  ];

  const { activeTab, setActiveTab, filtered, getMediaUrl, scrollRef } =
    useAutoScrollProducts(foods);

  const firstProductImage =
    filtered.length > 0 ? getMediaUrl(filtered[0]) : "/order1.png";

  const tabButtonsRef = useRef<Array<HTMLButtonElement | null>>([]);

  // ⏳ Loading state (important for perceived performance)
  if (isLoading) {
    return (
      <div className="w-full mt-10 px-4">
        <p className="text-sm text-muted-foreground">{t("loading")}...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 mt-10 px-4">
      {/* TABS */}
      <div className="flex justify-center">
        <div className="bg-muted rounded-xl p-1 flex gap-1" role="tablist">
          {tabs.map((tab, idx) => {
            const active = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                ref={(el) => {
                  tabButtonsRef.current[idx] = el;
                }}
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  active
                    ? "bg-background text-foreground shadow"
                    : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* PRODUCTS */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <img
              src={firstProductImage}
              className="w-8 h-8 rounded-md border object-cover"
            />
            <h2 className="text-lg font-semibold">
              {activeTab === "featured"
                ? t("featured")
                : activeTab === "new"
                ? t("new")
                : t("bestseller")}
            </h2>
          </div>

          <Link
            href={`/${locale}/category/all`}
            className="flex items-center gap-1 text-sm text-muted-foreground"
          >
            {t("see_more")} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm italic text-muted-foreground">
            {t("no_products_in_category")}
          </p>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar"
          >
            {filtered.map((item) => (
              <div
                key={item.id ?? item.foodId}
                data-auto-item
                className="
  snap-start
  w-[calc(50%-12px)]
  sm:w-[calc(33.333%-16px)]
  md:w-[calc(25%-18px)]
  lg:w-[calc(20%-20px)]
  shrink-0
"
              >
                <FoodCard food={item} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AutoScrollProducts;
