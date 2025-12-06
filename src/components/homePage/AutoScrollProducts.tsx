/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useFood } from "@/app/[locale]/provider/FoodDataProvider";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { FoodCard } from "../FoodCard";

type TabKey = "featured" | "new" | "bestseller";

export const AutoScrollProducts = () => {
  const { foodData } = useFood();
  const { locale, t } = useI18n();

  const tabs: { key: TabKey; label: string }[] = [
    { key: "featured", label: t("featured") },
    { key: "new", label: t("new") },
    { key: "bestseller", label: t("bestseller") },
  ];

  const [activeTab, setActiveTab] = useState<TabKey>("featured");

  // keep stable copy of products (shuffle only on foodData change)
  const products = useMemo(() => {
    // preserve backend order by default, but if you want randomize keep this line:
    return [...foodData].sort(() => Math.random() - 0.5);
  }, [foodData]);

  // Helpers
  const getMediaUrl = (media?: string | File): string => {
    if (!media) return "/placeholder.png";
    return typeof media === "string" ? media : URL.createObjectURL(media);
  };

  // Filter/sort per tab
  const filtered = useMemo(() => {
    if (!products || products.length === 0) return [];

    switch (activeTab) {
      case "featured": {
        const featured = products.filter((p) => !!(p as any).isFeatured);
        if (featured.length > 0) return featured;
        // fallback: top sellers if no explicit featured items
        return [...products].sort(
          (a, b) => (b.salesCount || 0) - (a.salesCount || 0)
        );
      }
      case "new": {
        return [...products].sort((a, b) => {
          const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return db - da;
        });
      }
      case "bestseller": {
        return [...products].sort(
          (a, b) => (b.salesCount || 0) - (a.salesCount || 0)
        );
      }
      default:
        return products;
    }
  }, [products, activeTab]);

  const firstProductImage =
    filtered.length > 0 ? getMediaUrl(filtered[0].image) : "/order.png";

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const [itemWidth, setItemWidth] = useState<number>(260);

  // measure item width using ResizeObserver (more robust than one-time read)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const measure = () => {
      const el = container.querySelector<HTMLElement>("[data-auto-item]");
      if (!el) return;
      const gap =
        Number(getComputedStyle(container).gap?.replace("px", "") || 0) || 0;
      setItemWidth(el.offsetWidth + gap);
    };

    // initial measure
    measure();

    // setup ResizeObserver on container to re-measure on resize/layout changes
    if (typeof ResizeObserver !== "undefined") {
      observerRef.current = new ResizeObserver(() => measure());
      observerRef.current.observe(container);
      const first = container.querySelector("[data-auto-item]");
      if (first) observerRef.current.observe(first as Element);
    } else {
      window.addEventListener("resize", measure);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      } else {
        window.removeEventListener("resize", measure);
      }
    };
  }, [filtered.length]);

  // autoscroll logic
  const SCROLL_INTERVAL_MS = 6000;

  const stopAutoScroll = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startAutoScroll = useCallback(() => {
    stopAutoScroll();
    intervalRef.current = window.setInterval(() => {
      const container = scrollRef.current;
      if (!container) return;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScroll - 2) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: itemWidth, behavior: "smooth" });
      }
    }, SCROLL_INTERVAL_MS);
  }, [itemWidth, stopAutoScroll]);

  // start interval whenever itemWidth or filtered length changes
  useEffect(() => {
    // don't start if there's nothing to scroll
    const container = scrollRef.current;
    if (!container) return;
    if (container.scrollWidth <= container.clientWidth) {
      stopAutoScroll();
      return;
    }
    startAutoScroll();
    return () => stopAutoScroll();
  }, [itemWidth, filtered.length, startAutoScroll, stopAutoScroll]);

  // pause on hover; resume on leave — attach listeners to container
  useEffect(() => {
    const cont = scrollRef.current;
    if (!cont) return;

    const handleEnter = () => stopAutoScroll();
    const handleLeave = () => startAutoScroll();

    cont.addEventListener("mouseenter", handleEnter);
    cont.addEventListener("mouseleave", handleLeave);
    return () => {
      cont.removeEventListener("mouseenter", handleEnter);
      cont.removeEventListener("mouseleave", handleLeave);
    };
  }, [startAutoScroll, stopAutoScroll]);

  // reset scroll when switching tabs (show start)
  useEffect(() => {
    const cont = scrollRef.current;
    if (!cont) return;
    cont.scrollTo({ left: 0, behavior: "smooth" });
  }, [activeTab]);

  // accessibility: keyboard nav for tabs
  const tabButtonsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const idx = tabs.findIndex((t) => t.key === activeTab);
    if (e.key === "ArrowRight") {
      const next = (idx + 1) % tabs.length;
      tabButtonsRef.current[next]?.focus();
      setActiveTab(tabs[next].key);
    } else if (e.key === "ArrowLeft") {
      const prev = (idx - 1 + tabs.length) % tabs.length;
      tabButtonsRef.current[prev]?.focus();
      setActiveTab(tabs[prev].key);
    } else if (e.key === "Home") {
      tabButtonsRef.current[0]?.focus();
      setActiveTab(tabs[0].key);
    } else if (e.key === "End") {
      tabButtonsRef.current[tabs.length - 1]?.focus();
      setActiveTab(tabs[tabs.length - 1].key);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 mt-10 px-6 md:px-10">
      <div className="w-full flex justify-center">
        <div
          className="bg-[#f3f4f6] rounded-xl p-1 flex gap-1"
          role="tablist"
          aria-label="Product sections"
          onKeyDown={handleTabKeyDown}
        >
          {tabs.map((tab, idx) => {
            const active = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                ref={(el) => {
                  tabButtonsRef.current[idx] = el;
                }} // Make sure no return value
                role="tab"
                aria-selected={active}
                aria-controls={`panel-${tab.key}`}
                id={`tab-${tab.key}`}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  active ? "bg-white text-black shadow-sm" : "text-gray-500"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <section className="w-full" aria-live="polite">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <img
              src={firstProductImage}
              alt={t("all_items") || "all items"}
              className="w-[32px] h-[32px] rounded-md object-cover border border-gray-700"
            />
            <h2 className="text-lg md:text-xl font-semibold text-white">
              {activeTab === "featured"
                ? t("featured")
                : activeTab === "new"
                ? t("new")
                : t("bestseller")}
            </h2>
          </div>

          <Link
            href={`/${locale}/category/all`}
            className="flex items-center gap-1 text-gray-400 text-sm hover:text-[#facc15] transition"
          >
            {t("see_more")} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {filtered.length === 0 ? (
          <p className="text-gray-500 text-sm italic">
            {t("no_products_in_category")}
          </p>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar py-2"
            id={`panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
          >
            {filtered.map((item) => (
              <div
                key={item.id}
                data-auto-item
                className="
                  snap-start
                  min-w-[160px] sm:min-w-[200px] md:min-w-[220px] lg:min-w-[240px] xl:min-w-[260px]
                  max-w-[260px]
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
