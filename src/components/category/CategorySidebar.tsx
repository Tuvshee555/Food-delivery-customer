/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
// src/components/category/CategorySidebar.tsx
"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

type Category = {
  id: string;
  categoryName: string;
  parentId: string | null;
};

type CategoryNode = Category & {
  children: CategoryNode[];
};

function buildTree(flat: Category[] = []) {
  const map = new Map<string, CategoryNode>();
  for (const c of flat) map.set(c.id, { ...c, children: [] });

  const roots: CategoryNode[] = [];
  for (const c of flat) {
    const node = map.get(c.id);
    if (!node) continue;
    if (c.parentId === null) roots.push(node);
    else {
      const parent = map.get(c.parentId);
      if (parent) parent.children.push(node);
      else roots.push(node);
    }
  }
  return { roots, map };
}

const CAT_CACHE_KEY = "categoriesCacheV1";
const ALL_COUNT_KEY = "allCountCacheV1";

export const CategorySidebar = ({
  filters,
  onFilterToggle,
}: {
  filters: { discount: boolean; featured: boolean; bestseller: boolean };
  onFilterToggle: (key: keyof typeof filters) => void;
}) => {
  const { t, locale } = useI18n();
  const pathname = usePathname();

  const [rawCategories, setRawCategories] = useState<Category[]>(() => {
    try {
      if (typeof window === "undefined") return [];
      const raw = sessionStorage.getItem(CAT_CACHE_KEY);
      return raw ? (JSON.parse(raw) as Category[]) : [];
    } catch {
      return [];
    }
  });

  const [allCount, setAllCount] = useState<number | null>(() => {
    try {
      if (typeof window === "undefined") return null;
      const raw = sessionStorage.getItem(ALL_COUNT_KEY);
      return raw ? Number(raw) : null;
    } catch {
      return null;
    }
  });

  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchCategories() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/category`,
          { signal }
        );
        if (!res.ok) return;
        const data = (await res.json()) as unknown;
        if (!Array.isArray(data)) return;
        const cats = data.map((c: any) => ({
          id: String(c.id),
          categoryName: String(c.categoryName ?? c.name ?? ""),
          parentId: c.parentId === null ? null : String(c.parentId),
        })) as Category[];

        setRawCategories(cats);
        try {
          sessionStorage.setItem(CAT_CACHE_KEY, JSON.stringify(cats));
        } catch {}
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error("Failed to fetch categories:", err);
      }
    }

    async function fetchAllCount() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/food`, {
          signal,
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data)) return;
        setAllCount(data.length);
        try {
          sessionStorage.setItem(ALL_COUNT_KEY, String(data.length));
        } catch {}
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error("Failed to fetch all count:", err);
      }
    }

    fetchCategories();
    fetchAllCount();

    return () => controller.abort();
  }, []);

  const { roots } = useMemo(() => buildTree(rawCategories), [rawCategories]);

  const filteredFlat = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rawCategories;
    return rawCategories.filter((c) =>
      c.categoryName.toLowerCase().includes(q)
    );
  }, [rawCategories, search]);

  const showFlatList = search.trim().length > 0;

  const extractIdFromPath = useCallback(() => {
    if (!pathname) return null;
    const parts = pathname.split("/");
    const idx = parts.findIndex((p) => p === "category");
    if (idx === -1) return null;
    return parts[idx + 1] ?? null;
  }, [pathname]);

  useEffect(() => {
    const activeId = extractIdFromPath();
    if (!activeId) return;
    const parentMap = new Map<string, string | null>();
    for (const c of rawCategories) parentMap.set(c.id, c.parentId ?? null);

    const toOpen: Record<string, boolean> = {};
    let cur: string | null | undefined = activeId;
    while (cur) {
      const parent = parentMap.get(cur);
      if (parent) toOpen[parent] = true;
      cur = parent ?? null;
    }
    setExpanded((prev) => ({ ...prev, ...toOpen }));
  }, [pathname, rawCategories.length]);

  const isAllActive =
    pathname?.includes(`/${locale}/category/all`) ||
    pathname?.includes(`/${locale}/all-products`);

  const toggle = (id: string) => setExpanded((s) => ({ ...s, [id]: !s[id] }));

  const renderNode = (node: CategoryNode, depth = 0) => {
    const isOpen = !!expanded[node.id];
    const activeId = extractIdFromPath();
    const isActive = activeId === node.id;
    return (
      <li key={node.id} className="mt-2">
        <div
          className={`flex items-center justify-between gap-2 py-1 ${
            depth > 0 ? "pl-3" : ""
          }`}
        >
          <div
            role="button"
            onClick={() => node.children.length > 0 && toggle(node.id)}
            className={`flex-1 cursor-pointer text-sm select-none ${
              isActive
                ? "text-[#facc15] font-medium"
                : "text-gray-100 hover:text-yellow-400"
            }`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                node.children.length > 0 && toggle(node.id);
              }
            }}
          >
            {node.categoryName}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/${locale}/category/${node.id}`}
              className={`text-xs whitespace-nowrap ${
                isActive
                  ? "text-[#facc15]"
                  : "text-gray-400 hover:text-yellow-400"
              }`}
            >
              {t("all") ?? "All"}
            </Link>

            {node.children.length > 0 && (
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(node.id);
                }}
                className="p-1 hover:text-yellow-400"
              >
                {isOpen ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
            )}
          </div>
        </div>

        {isOpen && node.children.length > 0 && (
          <ul className="mt-1 pl-4 border-l border-gray-800">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside className="bg-gradient-to-b from-[#111]/95 to-[#0a0a0a]/95 border border-gray-800/60 rounded-2xl p-5 flex flex-col gap-6 backdrop-blur-sm">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
        <input
          type="text"
          placeholder={t("search_by_name")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white"
        />
      </div>

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
            <span>{t("all_products")}</span>
            <span className="text-gray-400 text-xs">{allCount ?? "-"}</span>
          </Link>

          {showFlatList ? (
            filteredFlat.length === 0 ? (
              <li className="text-gray-500 text-xs italic mt-2">
                {t("empty")}
              </li>
            ) : (
              filteredFlat.map((cat) => {
                const catId = cat.id;
                const isActive = pathname?.includes(
                  `/${locale}/category/${catId}`
                );
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
                    {cat.categoryName}
                  </Link>
                );
              })
            )
          ) : roots.length === 0 ? (
            <li className="text-gray-400 text-xs py-2">
              {t("no_categories") ?? "No categories"}
            </li>
          ) : (
            roots.map((root) => renderNode(root, 0))
          )}
        </ul>
      </div>

      <div>
        <h3 className="text-xs uppercase text-gray-400 font-semibold tracking-wider mb-3 border-b border-gray-800/80 pb-2">
          {t("filters")}
        </h3>

        <ul className="flex flex-col gap-3 text-sm text-gray-300">
          <label className="flex items-center gap-3 cursor-pointer hover:text-[#facc15] transition">
            <input
              type="checkbox"
              checked={filters.discount}
              onChange={() => onFilterToggle("discount")}
              className="w-4 h-4"
            />
            {t("discount")}
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-[#facc15] transition">
            <input
              type="checkbox"
              checked={filters.featured}
              onChange={() => onFilterToggle("featured")}
              className="w-4 h-4"
            />
            {t("featured")}
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-[#facc15] transition">
            <input
              type="checkbox"
              checked={filters.bestseller}
              onChange={() => onFilterToggle("bestseller")}
              className="w-4 h-4"
            />
            {t("bestseller")}
          </label>
        </ul>
      </div>
    </aside>
  );
};
