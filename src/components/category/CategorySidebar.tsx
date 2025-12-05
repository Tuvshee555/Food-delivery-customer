/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

/**
 * CategorySidebar — preserves previous categories during loads to avoid flicker.
 * Uses sessionStorage to show cached list instantly, then updates from network.
 */
export const CategorySidebar = () => {
  const { t, locale } = useI18n();
  const [categories, setCategories] = useState<any[]>(() => {
    try {
      if (typeof window === "undefined") return [];
      const raw = sessionStorage.getItem("categoriesCache");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [allCount, setAllCount] = useState<number | null>(() => {
    try {
      if (typeof window === "undefined") return null;
      const raw = sessionStorage.getItem("allCountCache");
      return raw ? Number(raw) : null;
    } catch {
      return null;
    }
  });

  const pathname = usePathname();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchCats = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/category`,
          { signal }
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data)) return;

        // update only when we have valid data
        setCategories(data);
        try {
          sessionStorage.setItem("categoriesCache", JSON.stringify(data));
        } catch {}
      } catch (err) {
        if ((err as any).name === "AbortError") return;
        console.error("Failed to fetch categories:", err);
      }
    };

    const fetchAllCount = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/food`, {
          signal,
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data)) return;
        setAllCount(data.length);
        try {
          sessionStorage.setItem("allCountCache", String(data.length));
        } catch {}
      } catch (err) {
        if ((err as any).name === "AbortError") return;
        console.error("Failed to fetch food count:", err);
      }
    };

    // run both in background; they won't clear prior state
    fetchCats();
    fetchAllCount();

    return () => controller.abort();
  }, []);

  const filtered = categories.filter((cat) =>
    (cat.categoryName || cat.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const isAllActive =
    pathname?.includes(`/${locale}/category/all`) ||
    pathname?.includes(`/${locale}/all-products`);

  return (
    <aside className="bg-gradient-to-b from-[#111]/95 to-[#0a0a0a]/95 border border-gray-800/60 rounded-2xl p-5 flex flex-col gap-7 backdrop-blur-sm">
      {/* search */}
      <div className="relative group">
        <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
        <input
          type="text"
          placeholder={t("search_by_name")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white"
        />
      </div>

      {/* "All products" link */}
      <div>
        <h3 className="text-xs uppercase text-gray-400 font-semibold tracking-wider mb-3 border-b border-gray-800/80 pb-2">
          {t("categories")}
        </h3>

        <ul className="flex flex-col gap-1">
          <Link
            href={`/${locale}/category/all`}
            className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 flex justify-between items-center ${
              isAllActive
                ? "text-[#facc15] bg-[#1f1f1f]"
                : "text-gray-300 hover:text-[#facc15]"
            }`}
          >
            <span>{t("all_products") || "All products"}</span>
            <span className="text-gray-400 text-xs">{allCount ?? "-"}</span>
          </Link>

          {filtered.length === 0 && (
            <li className="text-gray-500 text-xs italic mt-2">{t("empty")}</li>
          )}

          {filtered.map((cat) => {
            const catId = cat.id;
            const isActive = pathname?.includes(`/${locale}/category/${catId}`);

            return (
              <Link
                key={catId}
                href={`/${locale}/category/${catId}`}
                className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? "text-[#facc15] bg-[#1f1f1f]"
                    : "text-gray-300 hover:text-[#facc15]"
                }`}
              >
                {cat.categoryName || cat.name}
              </Link>
            );
          })}
        </ul>
      </div>

      {/* filters */}
      <div>
        <h3 className="text-xs uppercase text-gray-400 font-semibold tracking-wider mb-3 border-b border-gray-800/80 pb-2">
          {t("filters")}
        </h3>

        <ul className="flex flex-col gap-3 text-sm text-gray-300">
          <label className="flex items-center gap-3 cursor-pointer hover:text-[#facc15] transition">
            <input type="checkbox" className="w-4 h-4" />
            {t("discount")}
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-[#facc15] transition">
            <input type="checkbox" className="w-4 h-4" />
            {t("featured")}
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-[#facc15] transition">
            <input type="checkbox" className="w-4 h-4" />
            {t("bestseller")}
          </label>
        </ul>
      </div>
    </aside>
  );
};
