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

  // stable copy (same as original)
  const products = useMemo(() => {
    return [...foodData].sort(() => Math.random() - 0.5);
  }, [foodData]);

  // SAFE image object URL map (create once per products change, revoke on cleanup)
  const mediaMapRef = useRef<Map<string, string>>(new Map());
  useEffect(() => {
    const created: string[] = [];
    mediaMapRef.current.clear();

    products.forEach((p: any) => {
      const id = p.id ?? p.foodId ?? Math.random().toString(36).slice(2, 9);
      const img = p.image;
      if (!img) return;
      if (typeof img === "string") {
        mediaMapRef.current.set(id, img);
      } else {
        try {
          const u = URL.createObjectURL(img);
          created.push(u);
          mediaMapRef.current.set(id, u);
        } catch {
          /* noop */
        }
      }
    });

    return () => {
      created.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch {}
      });
    };
  }, [products]);

  const getMediaUrl = (item: any) =>
    mediaMapRef.current.get(item.id ?? item.foodId ?? "") ?? "/placeholder.png";

  const filtered = useMemo(() => {
    if (!products || products.length === 0) return [];

    switch (activeTab) {
      case "featured": {
        const featured = products.filter((p: any) => !!p.isFeatured);
        if (featured.length > 0) return featured;
        return [...products].sort(
          (a: any, b: any) => (b.salesCount || 0) - (a.salesCount || 0)
        );
      }
      case "new": {
        return [...products].sort((a: any, b: any) => {
          const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return db - da;
        });
      }
      case "bestseller": {
        return [...products].sort(
          (a: any, b: any) => (b.salesCount || 0) - (a.salesCount || 0)
        );
      }
      default:
        return products;
    }
  }, [products, activeTab]);

  const firstProductImage =
    filtered.length > 0 ? getMediaUrl(filtered[0]) : "/order.png";

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const [itemWidth, setItemWidth] = useState<number>(260);

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

    // initial
    measure();

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

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    if (container.scrollWidth <= container.clientWidth) {
      stopAutoScroll();
      return;
    }
    startAutoScroll();
    return () => stopAutoScroll();
  }, [itemWidth, filtered.length, startAutoScroll, stopAutoScroll]);

  // pause on hover / resume on leave (desktop); touch drag always allowed on mobile
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

  // reset scroll when switching tabs
  useEffect(() => {
    const cont = scrollRef.current;
    if (!cont) return;
    cont.scrollTo({ left: 0, behavior: "smooth" });
  }, [activeTab]);

  // keyboard nav for tabs
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
    <div className="w-full flex flex-col gap-6 mt-10 px-4">
      <div className="w-full flex justify-center">
        <div
          className="bg-muted rounded-xl p-1 flex gap-1"
          role="tablist"
          aria-label={t("product_sections")}
          onKeyDown={handleTabKeyDown}
        >
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
                aria-controls={`panel-${tab.key}`}
                id={`tab-${tab.key}`}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
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

      <section className="w-full" aria-live="polite">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <img
              src={firstProductImage}
              alt={t("all_items") || "all items"}
              className="w-[32px] h-[32px] rounded-md object-cover border border-border"
            />
            <h2 className="text-lg md:text-xl font-semibold text-foreground">
              {activeTab === "featured"
                ? t("featured")
                : activeTab === "new"
                ? t("new")
                : t("bestseller")}
            </h2>
          </div>

          <Link
            href={`/${locale}/category/all`}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition"
          >
            {t("see_more")} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-sm italic">
            {t("no_products_in_category")}
          </p>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory touch-pan-x no-scrollbar"
            id={`panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
          >
            {filtered.map((item: any) => (
              <div
                key={
                  item.id ??
                  item.foodId ??
                  Math.random().toString(36).slice(2, 9)
                }
                data-auto-item
                className="
                  snap-start
                  min-w-[48vw]      /* mobile: ~2 per screen (big) */
                  sm:min-w-[32%]    /* ~3 per screen */
                  md:min-w-[25%]    /* ~4 per screen */
                  lg:min-w-[20%]    /* ~5 per screen */
                  max-w-[320px]
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
