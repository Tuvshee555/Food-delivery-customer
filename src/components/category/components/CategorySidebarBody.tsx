"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const extractIdFromPath = useCallback(() => {
    if (!mounted || !pathname) return null;
    const parts = pathname.split("/");
    const idx = parts.findIndex((p) => p === "category");
    return idx === -1 ? null : parts[idx + 1] ?? null;
  }, [pathname, mounted]);

  const handleCategoryClick = (node: CategoryNode) => {
    const hasChildren = node.children.length > 0;
    const isExpanded = !!expanded[node.id];

    if (hasChildren && !isExpanded) {
      toggle(node.id); // FIRST CLICK → expand
      return;
    }

    // SECOND CLICK or LEAF → navigate
    router.push(`/${locale}/category/${node.id}`);
    onNavigate?.();
  };

  const renderNode = (node: CategoryNode, depth = 0) => {
    const isOpen = !!expanded[node.id];
    const activeId = extractIdFromPath();
    const isActive = activeId === node.id;

    return (
      <li key={node.id}>
        <div
          className={`
            flex items-center justify-between
            py-2 rounded-md
            ${depth > 0 ? "pl-4" : "pl-2"}
            ${isActive ? "bg-card/70" : "hover:bg-muted/40"}
          `}
        >
          {/* CATEGORY TEXT */}
          <button
            onClick={() => handleCategoryClick(node)}
            className={`
              flex-1 text-left text-sm truncate
              ${isActive ? "text-primary font-medium" : "text-foreground/90"}
            `}
          >
            {node.categoryName}
          </button>

          {/* CHEVRON */}
          {node.children.length > 0 && (
            <button
              onClick={() => toggle(node.id)}
              className="p-1 text-muted-foreground"
              aria-label="Toggle category"
            >
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
        </div>

        {isOpen && node.children.length > 0 && (
          <ul className="ml-2 border-l border-border/60">
            {node.children.map((c) => renderNode(c, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("search_by_name")}
          className="w-full pl-9 py-2.5 text-sm border border-border rounded-lg bg-background"
        />
      </div>

      {/* CATEGORIES */}
      <ul className="flex flex-col gap-1">
        <button
          onClick={() => {
            router.push(`/${locale}/category/all`);
            onNavigate?.();
          }}
          className={`px-2 py-2 rounded-lg flex justify-between text-sm ${
            isAllActive ? "bg-card/70 text-primary" : "hover:bg-muted/40"
          }`}
        >
          <span className="font-medium">{t("all_products")}</span>
          <span className="text-xs text-muted-foreground">
            {mounted ? allCount ?? "-" : "-"}
          </span>
        </button>

        {showFlatList
          ? filteredFlat.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  router.push(`/${locale}/category/${c.id}`);
                  onNavigate?.();
                }}
                className="px-3 py-2 rounded-lg text-left text-sm hover:bg-muted/40"
              >
                {c.categoryName}
              </button>
            ))
          : roots.map((r) => renderNode(r))}
      </ul>

      {/* FILTERS */}
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
