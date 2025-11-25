/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, X } from "lucide-react";
import Link from "next/link";

export const SearchDialog = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [allFoods, setAllFoods] = useState<any[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch foods when modal opens
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/food`);
        const data = await res.json();
        if (Array.isArray(data)) setAllFoods(data);
      } catch (err) {
        console.error("Failed to load foods:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [open]);

  // Filter foods by inclusion (not just startsWith)
  useEffect(() => {
    if (!query.trim()) {
      setFilteredFoods([]);
      return;
    }
    const q = query.trim().toLowerCase();
    const matches = allFoods.filter((f) =>
      f.foodName?.toLowerCase().includes(q)
    );
    setFilteredFoods(matches);
  }, [query, allFoods]);

  // Highlight matching letters
  const highlightMatch = (text: string, keyword: string) => {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <span key={i} className="text-[#facc15] font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* 🔍 Trigger button (same as Email trigger style) */}
      <DialogTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center justify-center w-[42px] h-[42px] 
                     rounded-full border border-gray-700 bg-[#1a1a1a] 
                     hover:border-[#facc15] transition-all duration-300 
                     hover:shadow-[0_0_12px_rgba(250,204,21,0.3)]"
          aria-label="Search"
        >
          <Search className="w-5 h-5 text-gray-300" />
        </motion.button>
      </DialogTrigger>

      {/* Dialog content */}
      <AnimatePresence>
        {open && (
          <DialogContent className="w-[95%] max-w-[650px] bg-[#0e0e0e] text-white border border-gray-800 rounded-2xl shadow-[0_0_40px_-10px_rgba(250,204,21,0.1)] p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between mb-4 text-[#facc15]">
                <span>Хоол хайх</span>
                <button
                  onClick={() => setOpen(false)}
                  className="hover:text-[#facc15] text-gray-400 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </DialogTitle>
            </DialogHeader>

            {/* Input */}
            <div className="relative mb-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Хоолны нэрээр хайх..."
                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl px-4 py-3 text-sm 
                           focus:border-[#facc15] outline-none placeholder:text-gray-500"
              />
              <Search className="absolute right-4 top-3.5 text-gray-500" />
            </div>

            {/* Results */}
            <div className="max-h-[350px] overflow-y-auto space-y-2">
              {loading && (
                <p className="text-gray-400 text-center text-sm py-4">
                  Хайж байна...
                </p>
              )}

              {!loading && query && filteredFoods.length === 0 && (
                <p className="text-gray-500 text-center text-sm py-4">
                  Хоол олдсонгүй.
                </p>
              )}

              {filteredFoods.map((item, index) => (
                <motion.div
                  key={item.id || `${item.foodName}-${index}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={`/food/${item.id || item.id || ""}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1a1a1a]/70 transition"
                  >
                    <img
                      src={
                        typeof item.image === "string"
                          ? item.image
                          : "/placeholder.png"
                      }
                      alt={item.foodName}
                      className="w-[50px] h-[50px] object-cover rounded-md"
                    />
                    <div>
                      <h3 className="font-medium text-white text-sm">
                        {highlightMatch(item.foodName, query)}
                      </h3>
                      <p className="text-gray-400 text-xs">
                        {item.price?.toLocaleString()}₮
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};
