/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

export const CategorySidebar = () => {
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
    <aside className="bg-gradient-to-b from-[#111111]/95 to-[#0a0a0a]/95 border border-gray-800/60 rounded-2xl p-5 flex flex-col gap-7 shadow-[0_0_25px_rgba(250,204,21,0.03)] backdrop-blur-sm">
      {/* 🔍 Search */}
      <div className="relative group">
        <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4 transition group-focus-within:text-[#facc15]" />
        <input
          type="text"
          placeholder="Нэрээр хайх..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#facc15] focus:ring-1 focus:ring-[#facc15]/50 outline-none transition-all"
        />
      </div>

      {/* 📂 Category List */}
      <div>
        <h3 className="text-xs uppercase text-gray-400 font-semibold tracking-wider mb-3 border-b border-gray-800/80 pb-2">
          АНГИЛАЛ
        </h3>
        <ul className="flex flex-col gap-1">
          {filtered.length === 0 && (
            <li className="text-gray-500 text-xs italic">Хоосон байна</li>
          )}
          {filtered.map((cat) => {
            const isActive = pathname.includes(cat.id || cat.id);
            return (
              <Link
                key={cat.id || cat.id}
                href={`/category/${cat.id || cat.id}`}
                className={`relative px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? "text-[#facc15] bg-[#1f1f1f] shadow-[0_0_8px_rgba(250,204,21,0.15)]"
                    : "text-gray-300 hover:text-[#facc15] hover:bg-[#1a1a1a]"
                }`}
              >
                {cat.categoryName || cat.name}
                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-[3px] bg-[#facc15] rounded-r-sm"></span>
                )}
              </Link>
            );
          })}
        </ul>
      </div>

      {/* ⚙️ Other Filters */}
      <div>
        <h3 className="text-xs uppercase text-gray-400 font-semibold tracking-wider mb-3 border-b border-gray-800/80 pb-2">
          БУСАД
        </h3>
        <ul className="flex flex-col gap-3 text-sm text-gray-300">
          {[
            { label: "Хямдралтай", id: "discount" },
            { label: "Онцлох", id: "featured" },
            { label: "Бестселлер", id: "bestseller" },
          ].map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-3 cursor-pointer hover:text-[#facc15] transition"
            >
              <input
                type="checkbox"
                className="appearance-none w-4 h-4 border border-gray-600 rounded-sm bg-[#1a1a1a] checked:bg-[#facc15] checked:border-[#facc15] transition-all duration-150 cursor-pointer"
              />
              {opt.label}
            </label>
          ))}
        </ul>
      </div>
    </aside>
  );
};
