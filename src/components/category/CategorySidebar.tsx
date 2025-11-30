/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

export const CategorySidebar = () => {
  const { t, locale } = useI18n();
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/category`
        );
        const data = await res.json();
        if (Array.isArray(data)) setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCats();
  }, []);

  const filtered = categories.filter((cat) =>
    (cat.categoryName || cat.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <aside className="bg-gradient-to-b from-[#111]/95 to-[#0a0a0a]/95 border border-gray-800/60 rounded-2xl p-5 flex flex-col gap-7 backdrop-blur-sm">
      {/* 🔍 Search */}
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

      {/* 📂 Category List */}
      <div>
        <h3 className="text-xs uppercase text-gray-400 font-semibold tracking-wider mb-3 border-b border-gray-800/80 pb-2">
          {t("categories")}
        </h3>

        <ul className="flex flex-col gap-1">
          {filtered.length === 0 && (
            <li className="text-gray-500 text-xs italic">{t("empty")}</li>
          )}

          {filtered.map((cat) => {
            const catId = cat.id;
            const isActive = pathname.includes(`/${locale}/category/${catId}`);

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

      {/* ⚙️ Filters */}
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
