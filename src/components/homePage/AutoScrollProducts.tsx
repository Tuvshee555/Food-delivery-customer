/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useFood } from "@/app/[locale]/provider/FoodDataProvider";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { FoodCard } from "../FoodCard";

export const AutoScrollProducts = () => {
  const { foodData } = useFood();
  const { locale, t } = useI18n();

  const products = [...foodData].sort(() => Math.random() - 0.5);

  const getMediaUrl = (media?: string | File): string => {
    if (!media) return "/placeholder.png";
    return typeof media === "string" ? media : URL.createObjectURL(media);
  };

  const firstProductImage =
    products.length > 0 ? getMediaUrl(products[0].image) : "/order.png";

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  const [itemWidth, setItemWidth] = useState<number>(260);

  useEffect(() => {
    const el =
      scrollRef.current?.querySelector<HTMLElement>("[data-auto-item]");
    if (!el || !scrollRef.current) return;
    const gap =
      Number(
        getComputedStyle(scrollRef.current).gap?.replace("px", "") || "0"
      ) || 0;
    setItemWidth(el.offsetWidth + gap);
  }, [foodData.length]);

  useEffect(() => {
    const start = () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(() => {
        const container = scrollRef.current;
        if (!container) return;
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxScroll - 2) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: itemWidth, behavior: "smooth" });
        }
      }, 6000);
    };

    start();
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [itemWidth]);

  useEffect(() => {
    const cont = scrollRef.current;
    if (!cont) return;
    const handleEnter = () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
    const handleLeave = () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(() => {
        const container = scrollRef.current;
        if (!container) return;
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxScroll - 2) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: itemWidth, behavior: "smooth" });
        }
      }, 6000);
    };
    cont.addEventListener("mouseenter", handleEnter);
    cont.addEventListener("mouseleave", handleLeave);
    return () => {
      cont.removeEventListener("mouseenter", handleEnter);
      cont.removeEventListener("mouseleave", handleLeave);
    };
  }, [itemWidth]);

  if (!products || products.length === 0) {
    return (
      <div className="w-full flex flex-col gap-16 mt-10 px-6 md:px-10">
        <section className="w-full">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <img
                src="/order.png"
                alt="all items"
                className="w-[32px] h-[32px] rounded-md object-cover border border-gray-700"
              />
              <h2 className="text-lg md:text-xl font-semibold text-white">
                🛒 {t("all_items") || "Бүгд (ALL ITEMS)"}
              </h2>
            </div>
            <Link
              href={`/${locale}/category/all`}
              className="flex items-center gap-1 text-gray-400 text-sm hover:text-[#facc15] transition"
            >
              {t("see_more")} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-gray-500 text-sm italic">
            {t("no_products_in_category")}
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-16 mt-10 px-6 md:px-10">
      <section className="w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <img
              src={firstProductImage}
              alt={t("all_items") || "all items"}
              className="w-[32px] h-[32px] rounded-md object-cover border border-gray-700"
            />
            <h2 className="text-lg md:text-xl font-semibold text-white">
              🛒 {t("all_items") || "Бүгд (ALL ITEMS)"}
            </h2>
          </div>

          <Link
            href={`/${locale}/category/all`}
            className="flex items-center gap-1 text-gray-400 text-sm hover:text-[#facc15] transition"
          >
            {t("see_more")} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar"
        >
          {products.map((item) => (
            <div
              key={item.id}
              data-auto-item
              className="snap-start min-w-[250px] max-w-[250px]"
            >
              <FoodCard food={item} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
