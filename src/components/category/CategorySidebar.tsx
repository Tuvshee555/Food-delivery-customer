/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Search, ChevronDown, ChevronRight, X } from "lucide-react";
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

  // server-safe initial states (no window/sessionStorage access here)
  const [rawCategories, setRawCategories] = useState<Category[]>([]);
  const [allCount, setAllCount] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // mounted = true only after client mount; prevents hydration mismatch
  const [mounted, setMounted] = useState(false);

  // mobile drawer state
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    // fetch categories from backend and populate state + sessionStorage
    async function fetchCategories() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/category`,
          {
            signal,
          }
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

        if (mounted) {
          try {
            sessionStorage.setItem(CAT_CACHE_KEY, JSON.stringify(cats));
          } catch {
            /* ignore */
          }
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error("Failed to fetch categories:", err);
      }
    }

    // fetch all products to count (used in "All products" badge)
    async function fetchAllCount() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/food`, {
          signal,
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data)) return;
        setAllCount(data.length);
        if (mounted) {
          try {
            sessionStorage.setItem(ALL_COUNT_KEY, String(data.length));
          } catch {}
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error("Failed to fetch all count:", err);
      }
    }

    // Attempt to hydrate from sessionStorage (client-side only)
    try {
      if (typeof window !== "undefined" && mounted) {
        const raw = sessionStorage.getItem(CAT_CACHE_KEY);
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as Category[];
            if (Array.isArray(parsed) && parsed.length > 0) {
              setRawCategories(parsed);
            }
          } catch {}
        }

        const rawCount = sessionStorage.getItem(ALL_COUNT_KEY);
        if (rawCount) {
          const n = Number(rawCount);
          if (!Number.isNaN(n)) setAllCount(n);
        }
      }
    } catch {
      // ignore storage read errors
    }

    fetchCategories();
    fetchAllCount();

    return () => controller.abort();
  }, [mounted]);

  const { roots } = useMemo(() => buildTree(rawCategories), [rawCategories]);

  const filteredFlat = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rawCategories;
    return rawCategories.filter((c) =>
      c.categoryName.toLowerCase().includes(q)
    );
  }, [rawCategories, search]);

  const showFlatList = search.trim().length > 0;

  // helpers that depend on pathname should only run when mounted to avoid mismatch
  const extractIdFromPath = useCallback(() => {
    if (!mounted || !pathname) return null;
    const parts = pathname.split("/");
    const idx = parts.findIndex((p) => p === "category");
    if (idx === -1) return null;
    return parts[idx + 1] ?? null;
  }, [pathname, mounted]);

  useEffect(() => {
    if (!mounted) return;
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
  }, [pathname, rawCategories.length, mounted]);

  const isAllActive =
    mounted &&
    (pathname?.includes(`/${locale}/category/all`) ||
      pathname?.includes(`/${locale}/all-products`));

  const toggle = (id: string) => setExpanded((s) => ({ ...s, [id]: !s[id] }));

  const renderNode = (node: CategoryNode, depth = 0) => {
    const isOpen = !!expanded[node.id];
    const activeId = mounted ? extractIdFromPath() : null;
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
                ? "text-primary font-medium"
                : "text-foreground/90 hover:text-primary"
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
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
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
                className="p-1 hover:text-primary"
                aria-label={
                  isOpen ? t("collapse") ?? "Collapse" : t("expand") ?? "Expand"
                }
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
          <ul className="mt-1 pl-4 border-l border-border/60">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  const SidebarBody = () => (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-muted-foreground w-4 h-4" />
        <input
          type="text"
          placeholder={t("search_by_name")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition"
        />
      </div>

      <div>
        <h3 className="text-xs uppercase text-muted-foreground font-semibold tracking-wider mb-3 border-b border-border/60 pb-2">
          {t("categories")}
        </h3>

        <ul className="flex flex-col gap-1">
          <Link
            href={`/${locale}/category/all`}
            className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 flex justify-between items-center ${
              isAllActive
                ? "text-primary bg-card/70"
                : "text-foreground/90 hover:text-primary"
            }`}
            onClick={() => {
              if (mobileOpen) setMobileOpen(false);
            }}
          >
            <span>{t("all_products")}</span>
            <span className="text-muted-foreground text-xs">
              {mounted ? allCount ?? "-" : "-"}
            </span>
          </Link>

          {/* If searching use the flat results */}
          {showFlatList ? (
            filteredFlat.length === 0 ? (
              <li className="text-muted-foreground text-xs italic mt-2">
                {t("empty")}
              </li>
            ) : (
              filteredFlat.map((cat) => {
                const catId = cat.id;
                const isActive = mounted
                  ? pathname?.includes(`/${locale}/category/${catId}`)
                  : false;
                return (
                  <Link
                    key={catId}
                    href={`/${locale}/category/${catId}`}
                    className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? "text-primary bg-card/70"
                        : "text-foreground/90 hover:text-primary"
                    }`}
                    onClick={() => {
                      if (mobileOpen) setMobileOpen(false);
                    }}
                  >
                    {cat.categoryName}
                  </Link>
                );
              })
            )
          ) : roots.length === 0 ? (
            <li className="text-muted-foreground text-xs py-2">
              {t("no_categories") ?? "No categories"}
            </li>
          ) : (
            roots.map((root) => <div key={root.id}>{renderNode(root, 0)}</div>)
          )}
        </ul>
      </div>

      <div>
        <h3 className="text-xs uppercase text-muted-foreground font-semibold tracking-wider mb-3 border-b border-border/60 pb-2">
          {t("filters")}
        </h3>

        <ul className="flex flex-col gap-3 text-sm">
          <label className="flex items-center gap-3 cursor-pointer hover:text-primary transition text-foreground/90">
            <input
              type="checkbox"
              checked={filters.discount}
              onChange={() => onFilterToggle("discount")}
              className="w-4 h-4 accent-primary"
            />
            {t("discount")}
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-primary transition text-foreground/90">
            <input
              type="checkbox"
              checked={filters.featured}
              onChange={() => onFilterToggle("featured")}
              className="w-4 h-4 accent-primary"
            />
            {t("featured")}
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-primary transition text-foreground/90">
            <input
              type="checkbox"
              checked={filters.bestseller}
              onChange={() => onFilterToggle("bestseller")}
              className="w-4 h-4 accent-primary"
            />
            {t("bestseller")}
          </label>
        </ul>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile open button (parent layouts can hide this if they render their own) */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="w-full flex items-center justify-between px-4 py-2 rounded-lg bg-card border border-border text-foreground/90 hover:bg-card/95 transition"
          aria-label={t("open_categories")}
        >
          <span className="font-medium">{t("categories")}</span>
          <span className="text-sm text-muted-foreground">
            {mounted ? allCount ?? "-" : "-"}
          </span>
        </button>
      </div>

      {/* Desktop / tablet sidebar */}
      <aside className="hidden md:flex md:w-80 lg:w-96 flex-col">
        <div className="bg-card text-card-foreground border border-border rounded-2xl p-5 flex flex-col gap-6 w-[250px]">
          <SidebarBody />
        </div>
      </aside>

      {/* Mobile sheet */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[2000] flex"
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />

          {/* sheet body */}
          <div className="relative w-full max-w-[420px] ml-auto h-full bg-card text-card-foreground border-l border-border p-5 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {t("categories")}
              </h3>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground"
                aria-label={t("close")}
              >
                <X />
              </button>
            </div>

            <SidebarBody />
          </div>
        </div>
      )}
    </>
  );
};
