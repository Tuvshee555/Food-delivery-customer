"use client";

import Link from "next/link";
import { useCallback } from "react";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { Category, CategoryNode } from "./categoryTree";

type Props = {
  locale: string;
  t: (k: string) => string;
  pathname: string | null;
  mounted: boolean;

  search: string;
  setSearch: (v: string) => void;

  roots: CategoryNode[];
  filteredFlat: Category[];
  showFlatList: boolean;

  expanded: Record<string, boolean>;
  toggle: (id: string) => void;

  allCount: number | null;
  isAllActive: boolean;

  filters: {
    discount: boolean;
    featured: boolean;
    bestseller: boolean;
  };
  onFilterToggle: (key: keyof Props["filters"]) => void;

  onNavigate?: () => void;
};

export const CategorySidebarBody = ({
  locale,
  t,
  pathname,
  mounted,
  search,
  setSearch,
  roots,
  filteredFlat,
  showFlatList,
  expanded,
  toggle,
  allCount,
  isAllActive,
  filters,
  onFilterToggle,
  onNavigate,
}: Props) => {
  const extractIdFromPath = useCallback(() => {
    if (!mounted || !pathname) return null;
    const parts = pathname.split("/");
    const idx = parts.findIndex((p) => p === "category");
    return idx === -1 ? null : parts[idx + 1] ?? null;
  }, [pathname, mounted]);

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
            onClick={() => node.children.length && toggle(node.id)}
            className={`flex-1 cursor-pointer text-sm ${
              isActive
                ? "text-primary font-medium"
                : "text-foreground/90 hover:text-primary"
            }`}
          >
            {node.categoryName}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/${locale}/category/${node.id}`}
              onClick={onNavigate}
              className={`text-xs ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {t("all")}
            </Link>

            {node.children.length > 0 && (
              <button onClick={() => toggle(node.id)}>
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
          <ul className="pl-4 border-l border-border/60">
            {node.children.map((c) => renderNode(c, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("search_by_name")}
          className="w-full pl-9 py-2.5 text-sm border border-border rounded-lg bg-background"
        />
      </div>

      {/* Categories */}
      <div>
        <ul className="flex flex-col gap-1">
          <Link
            href={`/${locale}/category/all`}
            onClick={onNavigate}
            className={`px-3 py-2 rounded-lg flex justify-between ${
              isAllActive ? "bg-card/70 text-primary" : ""
            }`}
          >
            <span>{t("all_products")}</span>
            <span className="text-xs text-muted-foreground">
              {mounted ? allCount ?? "-" : "-"}
            </span>
          </Link>

          {showFlatList
            ? filteredFlat.map((c) => (
                <Link
                  key={c.id}
                  href={`/${locale}/category/${c.id}`}
                  onClick={onNavigate}
                  className="px-3 py-2 rounded-lg text-sm"
                >
                  {c.categoryName}
                </Link>
              ))
            : roots.map((r) => renderNode(r))}
        </ul>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 text-sm">
        {(["discount", "featured", "bestseller"] as const).map((k) => (
          <label key={k} className="flex gap-2">
            <input
              type="checkbox"
              checked={filters[k]}
              onChange={() => onFilterToggle(k)}
            />
            {t(k)}
          </label>
        ))}
      </div>
    </div>
  );
};
